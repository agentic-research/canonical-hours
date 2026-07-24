import { z } from "zod";

export interface ObservationDraft<TPayload = unknown> {
  readonly subject: string;
  readonly kind: string;
  readonly eventTimeMs: number;
  readonly providerEventId: string;
  readonly payload: TPayload;
}

export type ObservationCandidate = Omit<ObservationDraft, "payload"> & {
  readonly payload: unknown;
};

export interface ObserveInput<TConfig, TCursor = string> {
  readonly config: TConfig;
  readonly cursor?: TCursor;
  readonly signal?: AbortSignal;
}

export interface ExtractPage<TRaw, TCursor = string> {
  readonly records: readonly TRaw[];
  readonly nextCursor?: TCursor;
}

export interface ObservationBatch<TPayload, TCursor = string> {
  readonly observations: readonly ObservationDraft<TPayload>[];
  readonly nextCursor?: TCursor;
}

export interface Extractor<TConfig, TRaw, TCursor = string> {
  readonly name: string;
  extract(input: ObserveInput<TConfig, TCursor>): Promise<ExtractPage<TRaw, TCursor>>;
}

export interface Transformer<TRaw, TPayload> {
  readonly payloadSchema: z.ZodType<TPayload>;
  transform(raw: TRaw): ObservationCandidate | null;
}

export interface Observer<TConfig, TPayload, TCursor = string> {
  readonly name: string;
  observe(input: ObserveInput<TConfig, TCursor>): Promise<ObservationBatch<TPayload, TCursor>>;
}

const ObservationMetadataSchema = z.object({
  subject: z.string().min(1),
  kind: z.string().min(1),
  eventTimeMs: z.number().int().nonnegative().safe(),
  providerEventId: z.string().min(1),
}).strict();

export class ObservationValidationError extends Error {
  readonly observerName: string;
  readonly recordIndex: number;
  readonly issues: readonly z.core.$ZodIssue[];

  constructor(observerName: string, recordIndex: number, error: z.ZodError) {
    super(`observer ${observerName} produced an invalid observation at record ${recordIndex}`);
    this.name = "ObservationValidationError";
    this.observerName = observerName;
    this.recordIndex = recordIndex;
    this.issues = error.issues;
  }
}

export class ObservationPipeline<TConfig, TRaw, TPayload, TCursor = string>
implements Observer<TConfig, TPayload, TCursor> {
  readonly name: string;

  constructor(
    private readonly extractor: Extractor<TConfig, TRaw, TCursor>,
    private readonly transformer: Transformer<TRaw, TPayload>,
  ) {
    this.name = extractor.name;
  }

  async observe(input: ObserveInput<TConfig, TCursor>): Promise<ObservationBatch<TPayload, TCursor>> {
    const page = await this.extractor.extract(input);
    const observations: ObservationDraft<TPayload>[] = [];

    for (const [recordIndex, raw] of page.records.entries()) {
      const candidate = this.transformer.transform(raw);
      if (candidate === null) continue;

      const { payload: candidatePayload, ...candidateMetadata } = candidate;
      const metadata = ObservationMetadataSchema.safeParse(candidateMetadata);
      if (!metadata.success) {
        throw new ObservationValidationError(this.name, recordIndex, metadata.error);
      }

      const payload = this.transformer.payloadSchema.safeParse(candidatePayload);
      if (!payload.success) {
        throw new ObservationValidationError(this.name, recordIndex, payload.error);
      }

      observations.push({
        ...metadata.data,
        payload: payload.data,
      });
    }

    return {
      observations,
      ...(page.nextCursor === undefined ? {} : { nextCursor: page.nextCursor }),
    };
  }
}
