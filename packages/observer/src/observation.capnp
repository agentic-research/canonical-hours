@0xafb918731b9d4e51;

# Provider-produced fact. The receiving host adds tenant, route, observer
# implementation, authentication, receipt, and content-addressing fields.
struct ObservationDraft {
  subject         @0 :Text;
  kind            @1 :Text;
  eventTimeMs     @2 :Int64;
  providerEventId @3 :Text;

  # Canonical JSON bytes for a provider-independent payload. Language-native
  # Observer implementations validate the decoded payload before emission.
  payloadJson     @4 :Data;
}

struct ObservationBatch {
  observations @0 :List(ObservationDraft);

  # Opaque provider cursor proposed by the observer. A host commits it only
  # after the observations above are durable. Empty means no next cursor.
  nextCursor   @1 :Text;
}
