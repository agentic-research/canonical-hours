import { z } from 'zod'
import { ActivityCollectionFilter, ActivityFilter, AgentActivityCreateInput, AgentActivityCreatePromptInput, AgentActivityFilter, AgentActivityPromptCreateInputContent, AgentActivitySignal, AgentActivityType, AgentAutomationRetryResolutionStatus, AgentSessionCreateInput, AgentSessionCreateOnComment, AgentSessionCreateOnIssue, AgentSessionExternalUrlInput, AgentSessionStatus, AgentSessionType, AgentSessionUpdateExternalUrlInput, AgentSessionUpdateInput, AgentSessionUserStateInput, AgentSkillCreateInput, AgentSkillFilter, AgentSkillUpdateInput, AiConversationAckKind, AiConversationClientPlatform, AiConversationElicitationKind, AiConversationEntityCardWidgetArgsAction, AiConversationEntityCardWidgetArgsType, AiConversationEntityListWidgetArgsAction, AiConversationEntityListWidgetArgsEntitiesType, AiConversationErrorType, AiConversationInitialSource, AiConversationPartPhase, AiConversationPartType, AiConversationQueryUpdatesToolCallArgsUpdateType, AiConversationQueryViewToolCallArgsMode, AiConversationReadFileToolCallArgsMode, AiConversationStatus, AiConversationSubscribeToEventToolCallArgsKind, AiConversationSubscribeToEventToolCallArgsType, AiConversationTool, AiConversationWidgetName, AiPromptProgressFilter, AiPromptProgressStatus, AiPromptProgressStatusComparator, AiPromptProgressSubscriptionFilter, AiPromptType, AiPromptTypeComparator, AirbyteConfigurationInput, ApproximateNeedCountSort, AssigneeSort, AttachmentCollectionFilter, AttachmentCreateInput, AttachmentFilter, AttachmentUpdateInput, AuditEntryFilter, AuthenticationSessionType, BooleanComparator, CandidateRepository, CommentCollectionFilter, CommentCreateInput, CommentFilter, CommentUpdateInput, CompletedAtSort, ContactCreateInput, ContactSalesCreateInput, ContentComparator, ContextViewType, CreateOrganizationInput, CreatedAtSort, CustomViewCreateInput, CustomViewCreatedAtSort, CustomViewFilter, CustomViewNameSort, CustomViewSharedSort, CustomViewSortInput, CustomViewUpdateInput, CustomViewUpdatedAtSort, CustomerCountSort, CustomerCreateInput, CustomerCreatedAtSort, CustomerFilter, CustomerImportantCountSort, CustomerNeedCollectionFilter, CustomerNeedCreateFromAttachmentInput, CustomerNeedCreateInput, CustomerNeedFilter, CustomerNeedUpdateInput, CustomerRevenueSort, CustomerSort, CustomerSortInput, CustomerStatusCreateInput, CustomerStatusFilter, CustomerStatusSort, CustomerStatusType, CustomerStatusUpdateInput, CustomerTierCreateInput, CustomerTierFilter, CustomerTierUpdateInput, CustomerUpdateInput, CustomerUpsertInput, CustomerVisibilityMode, CustomersAttributesDataSourceConfigurationInput, CustomersAttributesDataSourceIntegrationInput, CustomersConfigurationInput, CycleCreateInput, CycleFilter, CyclePeriod, CyclePeriodComparator, CycleShiftAllInput, CycleSort, CycleUpdateInput, DateComparator, DateResolutionType, Day, DelegateSort, DeleteOrganizationInput, DiffFileState, DocumentContentAgentCheckpointMode, DocumentCreateInput, DocumentCreatedAtSort, DocumentCreatorSort, DocumentFilter, DocumentProjectSort, DocumentSortInput, DocumentTitleSort, DocumentUpdateInput, DocumentUpdatedAtSort, DueDateSort, EmailIntakeAddressCreateInput, EmailIntakeAddressType, EmailIntakeAddressUpdateInput, EmailUnsubscribeInput, EmailUserAccountAuthChallengeInput, EmojiCreateInput, EntityExternalLinkCreateInput, EntityExternalLinkUpdateInput, EstimateComparator, EstimateSort, EventTrackingInput, ExternalSyncService, FacetPageSource, FavoriteCreateInput, FavoriteUpdateInput, FeedItemFilter, FeedSummarySchedule, FrequencyResolutionType, FrontSettingsInput, GitAutomationStateCreateInput, GitAutomationStateUpdateInput, GitAutomationStates, GitAutomationTargetBranchCreateInput, GitAutomationTargetBranchUpdateInput, GitHubImportSettingsInput, GitHubPersonalSettingsInput, GitHubRemoveCodeAccessAction, GitHubRepoInput, GitHubRepoMappingInput, GitHubSettingsInput, GitLabSettingsInput, GitLinkKind, GithubOrgType, GongRecordingImportConfigInput, GongSettingsInput, GoogleSheetsExportSettings, GoogleSheetsSettingsInput, GoogleUserAccountAuthInput, IdComparator, IdentityProviderType, InheritanceEntityMapping, InitiativeCollectionFilter, InitiativeCreateInput, InitiativeCreatedAtSort, InitiativeFilter, InitiativeHealthSort, InitiativeHealthUpdatedAtSort, InitiativeLabelCollectionFilter, InitiativeLabelCreateInput, InitiativeLabelFilter, InitiativeLabelUpdateInput, InitiativeLeadTeamChangeMode, InitiativeManualSort, InitiativeNameSort, InitiativeOwnerSort, InitiativePrioritySort, InitiativeRelationCreateInput, InitiativeRelationUpdateInput, InitiativeSortInput, InitiativeStatus, InitiativeTab, InitiativeTargetDateSort, InitiativeToProjectCreateInput, InitiativeToProjectUpdateInput, InitiativeUpdateCreateInput, InitiativeUpdateFilter, InitiativeUpdateHealthType, InitiativeUpdateInput, InitiativeUpdateUpdateInput, InitiativeUpdatedAtSort, InitiativeUpdatesCollectionFilter, InitiativeUpdatesFilter, InitiativeVisibility, IntegrationCustomerDataAttributesRefreshInput, IntegrationRequestInput, IntegrationService, IntegrationSettingsInput, IntegrationTemplateCreateInput, IntegrationUpdateInput, IntegrationsSettingsCreateInput, IntegrationsSettingsUpdateInput, IntercomSettingsInput, IssueBatchCreateInput, IssueCollectionFilter, IssueCreateInput, IssueFilter, IssueIdComparator, IssueImportUpdateInput, IssueLabelCollectionFilter, IssueLabelCreateInput, IssueLabelFilter, IssueLabelUpdateInput, IssueReferenceInput, IssueRelationCreateInput, IssueRelationType, IssueRelationUpdateInput, IssueSharedAccessDisallowedField, IssueSharingPolicy, IssueSortInput, IssueSubscriptionFilter, IssueSuggestionCollectionFilter, IssueSuggestionFilter, IssueSuggestionState, IssueSuggestionType, IssueToReleaseCreateInput, IssueUpdateInput, JiraConfigurationInput, JiraFetchProjectStatusesInput, JiraLinearMappingInput, JiraPersonalSettingsInput, JiraProjectDataInput, JiraSettingsInput, JiraUpdateInput, JoinOrganizationInput, LabelGroupSort, LabelSort, LaunchDarklySettingsInput, LinearAgentMcpServersMode, LinearAgentTrustedSourcesMode, LinkCountSort, ManualSort, McpServerCustomHeaderInput, MicrosoftTeamsPostSettingsInput, MicrosoftTeamsSettingsInput, MilestoneSort, NameSort, NotificationCategory, NotificationCategoryPreferencesInput, NotificationChannel, NotificationDeliveryPreferencesChannelInput, NotificationDeliveryPreferencesDayInput, NotificationDeliveryPreferencesInput, NotificationDeliveryPreferencesScheduleInput, NotificationEntityInput, NotificationFilter, NotificationSubscriptionCreateInput, NotificationSubscriptionType, NotificationSubscriptionTypeComparator, NotificationSubscriptionUpdateInput, NotificationUpdateInput, NotionSettingsInput, NullableCommentFilter, NullableCustomerFilter, NullableCycleFilter, NullableDateComparator, NullableDocumentContentFilter, NullableDurationComparator, NullableInitiativeFilter, NullableInitiativeUpdateFilter, NullableIssueFilter, NullableNumberComparator, NullableProjectFilter, NullableProjectMilestoneFilter, NullableProjectUpdateFilter, NullableStringComparator, NullableTeamFilter, NullableTemplateFilter, NullableTimelessDateComparator, NullableUserFilter, NumberComparator, OAuthApplicationCreateInput, OAuthApplicationDistribution, OAuthApplicationGrantType, OAuthApplicationUpdateInput, OAuthClientApprovalStatus, OnboardingCustomerSurvey, OpsgenieInput, OrganizationAuthSettingsInput, OrganizationCodingAgentSettingsInput, OrganizationDomainAuthType, OrganizationDomainCreateInput, OrganizationDomainUpdateInput, OrganizationDomainVerificationInput, OrganizationInviteCreateInput, OrganizationInviteStatus, OrganizationInviteUpdateInput, OrganizationIpRestrictionInput, OrganizationLinearAgentMcpServerAllowlistEntryInput, OrganizationLinearAgentSettingsInput, OrganizationLinearAgentTrustedSourcesAllowlistEntryInput, OrganizationSecuritySettingsInput, OrganizationStartTrialInput, OrganizationThemeSettingsInput, OrganizationUpdateInput, OtherNotificationType, OwnerSort, PagerDutyInput, PaginationNulls, PaginationOrderBy, PaginationSortOrder, PartialNotificationChannelPreferencesInput, PartnerApplicationCreateInput, PipelineTab, PostType, PrioritySort, ProductIntelligenceScope, ProjectCollectionFilter, ProjectCreateInput, ProjectCreatedAtSort, ProjectFilter, ProjectHealthSort, ProjectLabelCollectionFilter, ProjectLabelCreateInput, ProjectLabelFilter, ProjectLabelUpdateInput, ProjectLeadSort, ProjectManualSort, ProjectMilestoneCollectionFilter, ProjectMilestoneCreateInput, ProjectMilestoneFilter, ProjectMilestoneMoveInput, ProjectMilestoneMoveIssueToTeamInput, ProjectMilestoneMoveProjectTeamsInput, ProjectMilestoneStatus, ProjectMilestoneUpdateInput, ProjectNameSort, ProjectPrioritySort, ProjectRelationCreateInput, ProjectRelationUpdateInput, ProjectSort, ProjectSortInput, ProjectStatusCreateInput, ProjectStatusFilter, ProjectStatusSort, ProjectStatusType, ProjectStatusUpdateInput, ProjectTab, ProjectUpdateCreateInput, ProjectUpdateFilter, ProjectUpdateHealthType, ProjectUpdateInput, ProjectUpdateReminderFrequency, ProjectUpdateUpdateInput, ProjectUpdatedAtSort, ProjectUpdatesCollectionFilter, ProjectUpdatesFilter, PullRequestCheckPresentation, PullRequestMergeMethod, PullRequestReferenceInput, PullRequestReviewTool, PullRequestStatus, PushSubscriptionCreateInput, PushSubscriptionType, ReactionCollectionFilter, ReactionCreateInput, ReactionFilter, RelationExistsComparator, ReleaseChannel, ReleaseCollectionFilter, ReleaseCompleteInput, ReleaseCompleteInputBase, ReleaseCreateInput, ReleaseDebugSinkInput, ReleaseDocumentInput, ReleaseFilter, ReleaseLinkInput, ReleaseNoteCreateInput, ReleaseNoteFilter, ReleaseNoteGenerationStatus, ReleaseNoteInput, ReleaseNoteUpdateInput, ReleasePipelineCollectionFilter, ReleasePipelineCreateInput, ReleasePipelineFilter, ReleasePipelineNameSort, ReleasePipelineSortInput, ReleasePipelineType, ReleasePipelineTypeComparator, ReleasePipelineUpdateInput, ReleaseSort, ReleaseSortInput, ReleaseStageCreateInput, ReleaseStageFilter, ReleaseStageSort, ReleaseStageType, ReleaseStageTypeComparator, ReleaseStageUpdateInput, ReleaseSyncInput, ReleaseSyncInputBase, ReleaseUpdateByPipelineInput, ReleaseUpdateByPipelineInputBase, ReleaseUpdateInput, RepositoryDataInput, RevenueSort, RoadmapCollectionFilter, RoadmapCreateInput, RoadmapFilter, RoadmapToProjectCreateInput, RoadmapToProjectUpdateInput, RoadmapUpdateInput, RootIssueSort, SlaDayCountType, SalesforceMetadataIntegrationComparator, SalesforceSettingsInput, SemanticSearchFilters, SemanticSearchResultType, SendStrategy, SentrySettingsInput, SizeSort, SlaStatus, SlaStatusComparator, SlaStatusSort, SlackAsksSettingsInput, SlackAsksTeamSettingsInput, SlackChannelNameMappingInput, SlackChannelType, SlackPostSettingsInput, SlackSettingsInput, SourceMetadataComparator, SourceTypeComparator, StartDateSort, StringArrayComparator, StringComparator, StringItemComparator, SubTypeComparator, SummaryGenerationStatus, TargetDateSort, TeamCollectionFilter, TeamCreateInput, TeamFilter, TeamMembershipCreateInput, TeamMembershipUpdateInput, TeamRetirementSubTeamHandling, TeamRoleType, TeamSecuritySettingsInput, TeamSort, TeamUpdateInput, TeamVisibility, TeamVisibilityComparator, TemplateCreateInput, TemplateUpdateInput, TierSort, TimeInStatusSort, TimeScheduleCreateInput, TimeScheduleEntryInput, TimeScheduleUpdateInput, TitleSort, TokenUserAccountAuthInput, TriageResponsibilityAction, TriageResponsibilityCreateInput, TriageResponsibilityManualSelectionInput, TriageResponsibilityUpdateInput, TriageRuleErrorType, UpdatedAtSort, UserCollectionFilter, UserContextViewType, UserDisplayNameSort, UserFilter, UserFlagType, UserFlagUpdateOperation, UserNameSort, UserRoleType, UserSettingsThemeDeviceType, UserSettingsThemeMode, UserSettingsThemePreset, UserSettingsUpdateInput, UserSortInput, UserUpdateInput, ViewPreferencesCreateInput, ViewPreferencesType, ViewPreferencesUpdateInput, ViewType, WebhookCreateInput, WebhookResourceType, WebhookUpdateInput, WorkflowStateCreateInput, WorkflowStateFilter, WorkflowStateSort, WorkflowStateUpdateInput, WorkflowTrigger, WorkflowTriggerType, WorkflowType, ZendeskSettingsInput, LinearIssuesQuery } from './linear-types'

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export const AgentActivitySignalSchema: z.ZodType<AgentActivitySignal> = z.nativeEnum(AgentActivitySignal);

export const AgentActivityTypeSchema: z.ZodType<AgentActivityType> = z.nativeEnum(AgentActivityType);

export const AgentAutomationRetryResolutionStatusSchema: z.ZodType<AgentAutomationRetryResolutionStatus> = z.nativeEnum(AgentAutomationRetryResolutionStatus);

export const AgentSessionStatusSchema: z.ZodType<AgentSessionStatus> = z.nativeEnum(AgentSessionStatus);

export const AgentSessionTypeSchema: z.ZodType<AgentSessionType> = z.nativeEnum(AgentSessionType);

export const AiConversationAckKindSchema: z.ZodType<AiConversationAckKind> = z.nativeEnum(AiConversationAckKind);

export const AiConversationClientPlatformSchema: z.ZodType<AiConversationClientPlatform> = z.nativeEnum(AiConversationClientPlatform);

export const AiConversationElicitationKindSchema: z.ZodType<AiConversationElicitationKind> = z.nativeEnum(AiConversationElicitationKind);

export const AiConversationEntityCardWidgetArgsActionSchema: z.ZodType<AiConversationEntityCardWidgetArgsAction> = z.nativeEnum(AiConversationEntityCardWidgetArgsAction);

export const AiConversationEntityCardWidgetArgsTypeSchema: z.ZodType<AiConversationEntityCardWidgetArgsType> = z.nativeEnum(AiConversationEntityCardWidgetArgsType);

export const AiConversationEntityListWidgetArgsActionSchema: z.ZodType<AiConversationEntityListWidgetArgsAction> = z.nativeEnum(AiConversationEntityListWidgetArgsAction);

export const AiConversationEntityListWidgetArgsEntitiesTypeSchema: z.ZodType<AiConversationEntityListWidgetArgsEntitiesType> = z.nativeEnum(AiConversationEntityListWidgetArgsEntitiesType);

export const AiConversationErrorTypeSchema: z.ZodType<AiConversationErrorType> = z.nativeEnum(AiConversationErrorType);

export const AiConversationInitialSourceSchema: z.ZodType<AiConversationInitialSource> = z.nativeEnum(AiConversationInitialSource);

export const AiConversationPartPhaseSchema: z.ZodType<AiConversationPartPhase> = z.nativeEnum(AiConversationPartPhase);

export const AiConversationPartTypeSchema: z.ZodType<AiConversationPartType> = z.nativeEnum(AiConversationPartType);

export const AiConversationQueryUpdatesToolCallArgsUpdateTypeSchema: z.ZodType<AiConversationQueryUpdatesToolCallArgsUpdateType> = z.nativeEnum(AiConversationQueryUpdatesToolCallArgsUpdateType);

export const AiConversationQueryViewToolCallArgsModeSchema: z.ZodType<AiConversationQueryViewToolCallArgsMode> = z.nativeEnum(AiConversationQueryViewToolCallArgsMode);

export const AiConversationReadFileToolCallArgsModeSchema: z.ZodType<AiConversationReadFileToolCallArgsMode> = z.nativeEnum(AiConversationReadFileToolCallArgsMode);

export const AiConversationStatusSchema: z.ZodType<AiConversationStatus> = z.nativeEnum(AiConversationStatus);

export const AiConversationSubscribeToEventToolCallArgsKindSchema: z.ZodType<AiConversationSubscribeToEventToolCallArgsKind> = z.nativeEnum(AiConversationSubscribeToEventToolCallArgsKind);

export const AiConversationSubscribeToEventToolCallArgsTypeSchema: z.ZodType<AiConversationSubscribeToEventToolCallArgsType> = z.nativeEnum(AiConversationSubscribeToEventToolCallArgsType);

export const AiConversationToolSchema: z.ZodType<AiConversationTool> = z.nativeEnum(AiConversationTool);

export const AiConversationWidgetNameSchema: z.ZodType<AiConversationWidgetName> = z.nativeEnum(AiConversationWidgetName);

export const AiPromptProgressStatusSchema: z.ZodType<AiPromptProgressStatus> = z.nativeEnum(AiPromptProgressStatus);

export const AiPromptTypeSchema: z.ZodType<AiPromptType> = z.nativeEnum(AiPromptType);

export const AuthenticationSessionTypeSchema: z.ZodType<AuthenticationSessionType> = z.nativeEnum(AuthenticationSessionType);

export const ContextViewTypeSchema: z.ZodType<ContextViewType> = z.nativeEnum(ContextViewType);

export const CustomerStatusTypeSchema: z.ZodType<CustomerStatusType> = z.nativeEnum(CustomerStatusType);

export const CustomerVisibilityModeSchema: z.ZodType<CustomerVisibilityMode> = z.nativeEnum(CustomerVisibilityMode);

export const CyclePeriodSchema: z.ZodType<CyclePeriod> = z.nativeEnum(CyclePeriod);

export const DateResolutionTypeSchema: z.ZodType<DateResolutionType> = z.nativeEnum(DateResolutionType);

export const DaySchema: z.ZodType<Day> = z.nativeEnum(Day);

export const DiffFileStateSchema: z.ZodType<DiffFileState> = z.nativeEnum(DiffFileState);

export const DocumentContentAgentCheckpointModeSchema: z.ZodType<DocumentContentAgentCheckpointMode> = z.nativeEnum(DocumentContentAgentCheckpointMode);

export const EmailIntakeAddressTypeSchema: z.ZodType<EmailIntakeAddressType> = z.nativeEnum(EmailIntakeAddressType);

export const ExternalSyncServiceSchema: z.ZodType<ExternalSyncService> = z.nativeEnum(ExternalSyncService);

export const FacetPageSourceSchema: z.ZodType<FacetPageSource> = z.nativeEnum(FacetPageSource);

export const FeedSummaryScheduleSchema: z.ZodType<FeedSummarySchedule> = z.nativeEnum(FeedSummarySchedule);

export const FrequencyResolutionTypeSchema: z.ZodType<FrequencyResolutionType> = z.nativeEnum(FrequencyResolutionType);

export const GitAutomationStatesSchema: z.ZodType<GitAutomationStates> = z.nativeEnum(GitAutomationStates);

export const GitHubRemoveCodeAccessActionSchema: z.ZodType<GitHubRemoveCodeAccessAction> = z.nativeEnum(GitHubRemoveCodeAccessAction);

export const GitLinkKindSchema: z.ZodType<GitLinkKind> = z.nativeEnum(GitLinkKind);

export const GithubOrgTypeSchema: z.ZodType<GithubOrgType> = z.nativeEnum(GithubOrgType);

export const IdentityProviderTypeSchema: z.ZodType<IdentityProviderType> = z.nativeEnum(IdentityProviderType);

export const InitiativeLeadTeamChangeModeSchema: z.ZodType<InitiativeLeadTeamChangeMode> = z.nativeEnum(InitiativeLeadTeamChangeMode);

export const InitiativeStatusSchema: z.ZodType<InitiativeStatus> = z.nativeEnum(InitiativeStatus);

export const InitiativeTabSchema: z.ZodType<InitiativeTab> = z.nativeEnum(InitiativeTab);

export const InitiativeUpdateHealthTypeSchema: z.ZodType<InitiativeUpdateHealthType> = z.nativeEnum(InitiativeUpdateHealthType);

export const InitiativeVisibilitySchema: z.ZodType<InitiativeVisibility> = z.nativeEnum(InitiativeVisibility);

export const IntegrationServiceSchema: z.ZodType<IntegrationService> = z.nativeEnum(IntegrationService);

export const IssueRelationTypeSchema: z.ZodType<IssueRelationType> = z.nativeEnum(IssueRelationType);

export const IssueSharedAccessDisallowedFieldSchema: z.ZodType<IssueSharedAccessDisallowedField> = z.nativeEnum(IssueSharedAccessDisallowedField);

export const IssueSharingPolicySchema: z.ZodType<IssueSharingPolicy> = z.nativeEnum(IssueSharingPolicy);

export const IssueSuggestionStateSchema: z.ZodType<IssueSuggestionState> = z.nativeEnum(IssueSuggestionState);

export const IssueSuggestionTypeSchema: z.ZodType<IssueSuggestionType> = z.nativeEnum(IssueSuggestionType);

export const LinearAgentMcpServersModeSchema: z.ZodType<LinearAgentMcpServersMode> = z.nativeEnum(LinearAgentMcpServersMode);

export const LinearAgentTrustedSourcesModeSchema: z.ZodType<LinearAgentTrustedSourcesMode> = z.nativeEnum(LinearAgentTrustedSourcesMode);

export const NotificationCategorySchema: z.ZodType<NotificationCategory> = z.nativeEnum(NotificationCategory);

export const NotificationChannelSchema: z.ZodType<NotificationChannel> = z.nativeEnum(NotificationChannel);

export const NotificationSubscriptionTypeSchema: z.ZodType<NotificationSubscriptionType> = z.nativeEnum(NotificationSubscriptionType);

export const OAuthApplicationDistributionSchema: z.ZodType<OAuthApplicationDistribution> = z.nativeEnum(OAuthApplicationDistribution);

export const OAuthApplicationGrantTypeSchema: z.ZodType<OAuthApplicationGrantType> = z.nativeEnum(OAuthApplicationGrantType);

export const OAuthClientApprovalStatusSchema: z.ZodType<OAuthClientApprovalStatus> = z.nativeEnum(OAuthClientApprovalStatus);

export const OrganizationDomainAuthTypeSchema: z.ZodType<OrganizationDomainAuthType> = z.nativeEnum(OrganizationDomainAuthType);

export const OrganizationInviteStatusSchema: z.ZodType<OrganizationInviteStatus> = z.nativeEnum(OrganizationInviteStatus);

export const OtherNotificationTypeSchema: z.ZodType<OtherNotificationType> = z.nativeEnum(OtherNotificationType);

export const PaginationNullsSchema: z.ZodType<PaginationNulls> = z.nativeEnum(PaginationNulls);

export const PaginationOrderBySchema: z.ZodType<PaginationOrderBy> = z.nativeEnum(PaginationOrderBy);

export const PaginationSortOrderSchema: z.ZodType<PaginationSortOrder> = z.nativeEnum(PaginationSortOrder);

export const PipelineTabSchema: z.ZodType<PipelineTab> = z.nativeEnum(PipelineTab);

export const PostTypeSchema: z.ZodType<PostType> = z.nativeEnum(PostType);

export const ProductIntelligenceScopeSchema: z.ZodType<ProductIntelligenceScope> = z.nativeEnum(ProductIntelligenceScope);

export const ProjectMilestoneStatusSchema: z.ZodType<ProjectMilestoneStatus> = z.nativeEnum(ProjectMilestoneStatus);

export const ProjectStatusTypeSchema: z.ZodType<ProjectStatusType> = z.nativeEnum(ProjectStatusType);

export const ProjectTabSchema: z.ZodType<ProjectTab> = z.nativeEnum(ProjectTab);

export const ProjectUpdateHealthTypeSchema: z.ZodType<ProjectUpdateHealthType> = z.nativeEnum(ProjectUpdateHealthType);

export const ProjectUpdateReminderFrequencySchema: z.ZodType<ProjectUpdateReminderFrequency> = z.nativeEnum(ProjectUpdateReminderFrequency);

export const PullRequestCheckPresentationSchema: z.ZodType<PullRequestCheckPresentation> = z.nativeEnum(PullRequestCheckPresentation);

export const PullRequestMergeMethodSchema: z.ZodType<PullRequestMergeMethod> = z.nativeEnum(PullRequestMergeMethod);

export const PullRequestReviewToolSchema: z.ZodType<PullRequestReviewTool> = z.nativeEnum(PullRequestReviewTool);

export const PullRequestStatusSchema: z.ZodType<PullRequestStatus> = z.nativeEnum(PullRequestStatus);

export const PushSubscriptionTypeSchema: z.ZodType<PushSubscriptionType> = z.nativeEnum(PushSubscriptionType);

export const ReleaseChannelSchema: z.ZodType<ReleaseChannel> = z.nativeEnum(ReleaseChannel);

export const ReleaseNoteGenerationStatusSchema: z.ZodType<ReleaseNoteGenerationStatus> = z.nativeEnum(ReleaseNoteGenerationStatus);

export const ReleasePipelineTypeSchema: z.ZodType<ReleasePipelineType> = z.nativeEnum(ReleasePipelineType);

export const ReleaseStageTypeSchema: z.ZodType<ReleaseStageType> = z.nativeEnum(ReleaseStageType);

export const SlaDayCountTypeSchema: z.ZodType<SlaDayCountType> = z.nativeEnum(SlaDayCountType);

export const SemanticSearchResultTypeSchema: z.ZodType<SemanticSearchResultType> = z.nativeEnum(SemanticSearchResultType);

export const SendStrategySchema: z.ZodType<SendStrategy> = z.nativeEnum(SendStrategy);

export const SlaStatusSchema: z.ZodType<SlaStatus> = z.nativeEnum(SlaStatus);

export const SlackChannelTypeSchema: z.ZodType<SlackChannelType> = z.nativeEnum(SlackChannelType);

export const SummaryGenerationStatusSchema: z.ZodType<SummaryGenerationStatus> = z.nativeEnum(SummaryGenerationStatus);

export const TeamRetirementSubTeamHandlingSchema: z.ZodType<TeamRetirementSubTeamHandling> = z.nativeEnum(TeamRetirementSubTeamHandling);

export const TeamRoleTypeSchema: z.ZodType<TeamRoleType> = z.nativeEnum(TeamRoleType);

export const TeamVisibilitySchema: z.ZodType<TeamVisibility> = z.nativeEnum(TeamVisibility);

export const TriageResponsibilityActionSchema: z.ZodType<TriageResponsibilityAction> = z.nativeEnum(TriageResponsibilityAction);

export const TriageRuleErrorTypeSchema: z.ZodType<TriageRuleErrorType> = z.nativeEnum(TriageRuleErrorType);

export const UserContextViewTypeSchema: z.ZodType<UserContextViewType> = z.nativeEnum(UserContextViewType);

export const UserFlagTypeSchema: z.ZodType<UserFlagType> = z.nativeEnum(UserFlagType);

export const UserFlagUpdateOperationSchema: z.ZodType<UserFlagUpdateOperation> = z.nativeEnum(UserFlagUpdateOperation);

export const UserRoleTypeSchema: z.ZodType<UserRoleType> = z.nativeEnum(UserRoleType);

export const UserSettingsThemeDeviceTypeSchema: z.ZodType<UserSettingsThemeDeviceType> = z.nativeEnum(UserSettingsThemeDeviceType);

export const UserSettingsThemeModeSchema: z.ZodType<UserSettingsThemeMode> = z.nativeEnum(UserSettingsThemeMode);

export const UserSettingsThemePresetSchema: z.ZodType<UserSettingsThemePreset> = z.nativeEnum(UserSettingsThemePreset);

export const ViewPreferencesTypeSchema: z.ZodType<ViewPreferencesType> = z.nativeEnum(ViewPreferencesType);

export const ViewTypeSchema: z.ZodType<ViewType> = z.nativeEnum(ViewType);

export const WebhookResourceTypeSchema: z.ZodType<WebhookResourceType> = z.nativeEnum(WebhookResourceType);

export const WorkflowTriggerSchema: z.ZodType<WorkflowTrigger> = z.nativeEnum(WorkflowTrigger);

export const WorkflowTriggerTypeSchema: z.ZodType<WorkflowTriggerType> = z.nativeEnum(WorkflowTriggerType);

export const WorkflowTypeSchema: z.ZodType<WorkflowType> = z.nativeEnum(WorkflowType);

export function ActivityCollectionFilterSchema(): z.ZodObject<Properties<ActivityCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ActivityCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => ActivityFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ActivityCollectionFilterSchema())).nullish(),
    some: z.lazy(() => ActivityFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function ActivityFilterSchema(): z.ZodObject<Properties<ActivityFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ActivityFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ActivityFilterSchema())).nullish(),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function AgentActivityCreateInputSchema(): z.ZodObject<Properties<AgentActivityCreateInput>> {
  return z.object({
    agentSessionId: z.string(),
    content: z.unknown(),
    contextualMetadata: z.unknown().nullish(),
    ephemeral: z.boolean().nullish(),
    id: z.string().nullish(),
    signal: AgentActivitySignalSchema.nullish(),
    signalMetadata: z.unknown().nullish()
  })
}

export function AgentActivityCreatePromptInputSchema(): z.ZodObject<Properties<AgentActivityCreatePromptInput>> {
  return z.object({
    agentSessionId: z.string(),
    content: z.lazy(() => AgentActivityPromptCreateInputContentSchema()),
    contextualMetadata: z.unknown().nullish(),
    id: z.string().nullish(),
    queued: z.boolean().nullish(),
    signal: AgentActivitySignalSchema.nullish(),
    signalMetadata: z.unknown().nullish(),
    sourceCommentId: z.string().nullish()
  })
}

export function AgentActivityFilterSchema(): z.ZodObject<Properties<AgentActivityFilter>> {
  return z.object({
    agentSessionId: z.lazy(() => StringComparatorSchema().nullish()),
    and: z.array(z.lazy(() => AgentActivityFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AgentActivityFilterSchema())).nullish(),
    sourceComment: z.lazy(() => NullableCommentFilterSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function AgentActivityPromptCreateInputContentSchema(): z.ZodObject<Properties<AgentActivityPromptCreateInputContent>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    type: AgentActivityTypeSchema.default(AgentActivityType.Prompt)
  })
}

export function AgentSessionCreateInputSchema(): z.ZodObject<Properties<AgentSessionCreateInput>> {
  return z.object({
    appUserId: z.string(),
    context: z.unknown().nullish(),
    id: z.string().nullish(),
    issueId: z.string().nullish()
  })
}

export function AgentSessionCreateOnCommentSchema(): z.ZodObject<Properties<AgentSessionCreateOnComment>> {
  return z.object({
    commentId: z.string(),
    externalLink: z.string().nullish(),
    externalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish()
  })
}

export function AgentSessionCreateOnIssueSchema(): z.ZodObject<Properties<AgentSessionCreateOnIssue>> {
  return z.object({
    externalLink: z.string().nullish(),
    externalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish(),
    issueId: z.string()
  })
}

export function AgentSessionExternalUrlInputSchema(): z.ZodObject<Properties<AgentSessionExternalUrlInput>> {
  return z.object({
    label: z.string(),
    url: z.string()
  })
}

export function AgentSessionUpdateExternalUrlInputSchema(): z.ZodObject<Properties<AgentSessionUpdateExternalUrlInput>> {
  return z.object({
    addedExternalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish(),
    externalLink: z.string().nullish(),
    externalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish(),
    removedExternalUrls: z.array(z.string()).nullish()
  })
}

export function AgentSessionUpdateInputSchema(): z.ZodObject<Properties<AgentSessionUpdateInput>> {
  return z.object({
    addedExternalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish(),
    dismissedAt: z.string().nullish(),
    externalLink: z.string().nullish(),
    externalUrls: z.array(z.lazy(() => AgentSessionExternalUrlInputSchema())).nullish(),
    plan: z.unknown().nullish(),
    removedExternalUrls: z.array(z.string()).nullish(),
    userState: z.array(z.lazy(() => AgentSessionUserStateInputSchema())).nullish()
  })
}

export function AgentSessionUserStateInputSchema(): z.ZodObject<Properties<AgentSessionUserStateInput>> {
  return z.object({
    lastReadAt: z.string().nullish(),
    userId: z.string()
  })
}

export function AgentSkillCreateInputSchema(): z.ZodObject<Properties<AgentSkillCreateInput>> {
  return z.object({
    body: z.string(),
    color: z.string().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    teamId: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function AgentSkillFilterSchema(): z.ZodObject<Properties<AgentSkillFilter>> {
  return z.object({
    and: z.array(z.lazy(() => AgentSkillFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AgentSkillFilterSchema())).nullish(),
    ownerId: z.lazy(() => IdComparatorSchema().nullish()),
    shared: z.lazy(() => BooleanComparatorSchema().nullish()),
    team: z.lazy(() => NullableTeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function AgentSkillUpdateInputSchema(): z.ZodObject<Properties<AgentSkillUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    color: z.string().nullish(),
    icon: z.string().nullish(),
    teamId: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function AiPromptProgressFilterSchema(): z.ZodObject<Properties<AiPromptProgressFilter>> {
  return z.object({
    and: z.array(z.lazy(() => AiPromptProgressFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AiPromptProgressFilterSchema())).nullish(),
    status: z.lazy(() => AiPromptProgressStatusComparatorSchema().nullish()),
    type: z.lazy(() => AiPromptTypeComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function AiPromptProgressStatusComparatorSchema(): z.ZodObject<Properties<AiPromptProgressStatusComparator>> {
  return z.object({
    eq: AiPromptProgressStatusSchema.nullish(),
    in: z.array(AiPromptProgressStatusSchema).nullish(),
    neq: AiPromptProgressStatusSchema.nullish(),
    nin: z.array(AiPromptProgressStatusSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function AiPromptProgressSubscriptionFilterSchema(): z.ZodObject<Properties<AiPromptProgressSubscriptionFilter>> {
  return z.object({
    commentId: z.lazy(() => IdComparatorSchema().nullish()),
    issueId: z.lazy(() => IdComparatorSchema().nullish()),
    pullRequestCommentId: z.lazy(() => IdComparatorSchema().nullish()),
    status: z.lazy(() => AiPromptProgressStatusComparatorSchema().nullish()),
    type: z.lazy(() => AiPromptTypeComparatorSchema().nullish())
  })
}

export function AiPromptTypeComparatorSchema(): z.ZodObject<Properties<AiPromptTypeComparator>> {
  return z.object({
    eq: AiPromptTypeSchema.nullish(),
    in: z.array(AiPromptTypeSchema).nullish(),
    neq: AiPromptTypeSchema.nullish(),
    nin: z.array(AiPromptTypeSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function AirbyteConfigurationInputSchema(): z.ZodObject<Properties<AirbyteConfigurationInput>> {
  return z.object({
    apiKey: z.string()
  })
}

export function ApproximateNeedCountSortSchema(): z.ZodObject<Properties<ApproximateNeedCountSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function AssigneeSortSchema(): z.ZodObject<Properties<AssigneeSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function AttachmentCollectionFilterSchema(): z.ZodObject<Properties<AttachmentCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => AttachmentCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    every: z.lazy(() => AttachmentFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AttachmentCollectionFilterSchema())).nullish(),
    some: z.lazy(() => AttachmentFilterSchema().nullish()),
    sourceType: z.lazy(() => SourceTypeComparatorSchema().nullish()),
    subtitle: z.lazy(() => NullableStringComparatorSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    url: z.lazy(() => StringComparatorSchema().nullish())
  })
}

export function AttachmentCreateInputSchema(): z.ZodObject<Properties<AttachmentCreateInput>> {
  return z.object({
    commentBody: z.string().nullish(),
    commentBodyData: z.unknown().nullish(),
    createAsUser: z.string().nullish(),
    displayIconUrl: z.string().nullish(),
    groupBySource: z.boolean().nullish(),
    iconUrl: z.string().nullish(),
    id: z.string().nullish(),
    issueId: z.string(),
    metadata: z.unknown().nullish(),
    subtitle: z.string().nullish(),
    title: z.string(),
    url: z.string()
  })
}

export function AttachmentFilterSchema(): z.ZodObject<Properties<AttachmentFilter>> {
  return z.object({
    and: z.array(z.lazy(() => AttachmentFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AttachmentFilterSchema())).nullish(),
    sourceType: z.lazy(() => SourceTypeComparatorSchema().nullish()),
    subtitle: z.lazy(() => NullableStringComparatorSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    url: z.lazy(() => StringComparatorSchema().nullish())
  })
}

export function AttachmentUpdateInputSchema(): z.ZodObject<Properties<AttachmentUpdateInput>> {
  return z.object({
    iconUrl: z.string().nullish(),
    metadata: z.unknown().nullish(),
    subtitle: z.string().nullish(),
    title: z.string()
  })
}

export function AuditEntryFilterSchema(): z.ZodObject<Properties<AuditEntryFilter>> {
  return z.object({
    actor: z.lazy(() => NullableUserFilterSchema().nullish()),
    and: z.array(z.lazy(() => AuditEntryFilterSchema())).nullish(),
    countryCode: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    entityId: z.lazy(() => StringComparatorSchema().nullish()),
    entityIdentifier: z.lazy(() => StringComparatorSchema().nullish()),
    entityType: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    ip: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => AuditEntryFilterSchema())).nullish(),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function BooleanComparatorSchema(): z.ZodObject<Properties<BooleanComparator>> {
  return z.object({
    eq: z.boolean().nullish(),
    neq: z.boolean().nullish()
  })
}

export function CandidateRepositorySchema(): z.ZodObject<Properties<CandidateRepository>> {
  return z.object({
    hostname: z.string(),
    repositoryFullName: z.string()
  })
}

export function CommentCollectionFilterSchema(): z.ZodObject<Properties<CommentCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CommentCollectionFilterSchema())).nullish(),
    body: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    documentContent: z.lazy(() => NullableDocumentContentFilterSchema().nullish()),
    every: z.lazy(() => CommentFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => NullableInitiativeFilterSchema().nullish()),
    initiativeUpdate: z.lazy(() => NullableInitiativeUpdateFilterSchema().nullish()),
    issue: z.lazy(() => NullableIssueFilterSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    or: z.array(z.lazy(() => CommentCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => NullableCommentFilterSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectUpdate: z.lazy(() => NullableProjectUpdateFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    some: z.lazy(() => CommentFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function CommentCreateInputSchema(): z.ZodObject<Properties<CommentCreateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    createAsUser: z.string().nullish(),
    createOnSyncedSlackThread: z.boolean().nullish(),
    createdAt: z.string().nullish(),
    displayIconUrl: z.string().nullish(),
    doNotSubscribeToIssue: z.boolean().nullish(),
    documentContentId: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    initiativeUpdateId: z.string().nullish(),
    issueId: z.string().nullish(),
    parentId: z.string().nullish(),
    postId: z.string().nullish(),
    projectId: z.string().nullish(),
    projectUpdateId: z.string().nullish(),
    quotedText: z.string().nullish(),
    subscriberIds: z.array(z.string()).nullish()
  })
}

export function CommentFilterSchema(): z.ZodObject<Properties<CommentFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CommentFilterSchema())).nullish(),
    body: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    documentContent: z.lazy(() => NullableDocumentContentFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => NullableInitiativeFilterSchema().nullish()),
    initiativeUpdate: z.lazy(() => NullableInitiativeUpdateFilterSchema().nullish()),
    issue: z.lazy(() => NullableIssueFilterSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    or: z.array(z.lazy(() => CommentFilterSchema())).nullish(),
    parent: z.lazy(() => NullableCommentFilterSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectUpdate: z.lazy(() => NullableProjectUpdateFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function CommentUpdateInputSchema(): z.ZodObject<Properties<CommentUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    doNotSubscribeToIssue: z.boolean().nullish(),
    quotedText: z.string().nullish(),
    resolvingCommentId: z.string().nullish(),
    resolvingUserId: z.string().nullish(),
    subscriberIds: z.array(z.string()).nullish()
  })
}

export function CompletedAtSortSchema(): z.ZodObject<Properties<CompletedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ContactCreateInputSchema(): z.ZodObject<Properties<ContactCreateInput>> {
  return z.object({
    browser: z.string().nullish(),
    clientVersion: z.string().nullish(),
    device: z.string().nullish(),
    disappointmentRating: z.number().nullish(),
    message: z.string(),
    operatingSystem: z.string().nullish(),
    type: z.string()
  })
}

export function ContactSalesCreateInputSchema(): z.ZodObject<Properties<ContactSalesCreateInput>> {
  return z.object({
    companySize: z.string().nullish(),
    distinctId: z.string().nullish(),
    email: z.string(),
    message: z.string().nullish(),
    name: z.string(),
    sessionId: z.string().nullish(),
    url: z.string().nullish(),
    utm: z.string().nullish(),
    utmFirstTouch: z.string().nullish()
  })
}

export function ContentComparatorSchema(): z.ZodObject<Properties<ContentComparator>> {
  return z.object({
    contains: z.string().nullish(),
    notContains: z.string().nullish()
  })
}

export function CreateOrganizationInputSchema(): z.ZodObject<Properties<CreateOrganizationInput>> {
  return z.object({
    domainAccess: z.boolean().nullish(),
    name: z.string(),
    timezone: z.string().nullish(),
    urlKey: z.string(),
    utm: z.string().nullish(),
    utmFirstTouch: z.string().nullish()
  })
}

export function CreatedAtSortSchema(): z.ZodObject<Properties<CreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomViewCreateInputSchema(): z.ZodObject<Properties<CustomViewCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    feedItemFilterData: z.lazy(() => FeedItemFilterSchema().nullish()),
    filterData: z.lazy(() => IssueFilterSchema().nullish()),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    initiativeFilterData: z.lazy(() => InitiativeFilterSchema().nullish()),
    initiativeId: z.string().nullish(),
    name: z.string(),
    ownerId: z.string().nullish(),
    projectFilterData: z.lazy(() => ProjectFilterSchema().nullish()),
    projectId: z.string().nullish(),
    shared: z.boolean().nullish(),
    teamId: z.string().nullish()
  })
}

export function CustomViewCreatedAtSortSchema(): z.ZodObject<Properties<CustomViewCreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomViewFilterSchema(): z.ZodObject<Properties<CustomViewFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomViewFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    hasFacet: z.boolean().nullish(),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    modelName: z.lazy(() => StringComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => CustomViewFilterSchema())).nullish(),
    shared: z.lazy(() => BooleanComparatorSchema().nullish()),
    team: z.lazy(() => NullableTeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomViewNameSortSchema(): z.ZodObject<Properties<CustomViewNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomViewSharedSortSchema(): z.ZodObject<Properties<CustomViewSharedSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomViewSortInputSchema(): z.ZodObject<Properties<CustomViewSortInput>> {
  return z.object({
    createdAt: z.lazy(() => CustomViewCreatedAtSortSchema().nullish()),
    name: z.lazy(() => CustomViewNameSortSchema().nullish()),
    shared: z.lazy(() => CustomViewSharedSortSchema().nullish()),
    updatedAt: z.lazy(() => CustomViewUpdatedAtSortSchema().nullish())
  })
}

export function CustomViewUpdateInputSchema(): z.ZodObject<Properties<CustomViewUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    feedItemFilterData: z.lazy(() => FeedItemFilterSchema().nullish()),
    filterData: z.lazy(() => IssueFilterSchema().nullish()),
    icon: z.string().nullish(),
    initiativeFilterData: z.lazy(() => InitiativeFilterSchema().nullish()),
    initiativeId: z.string().nullish(),
    name: z.string().nullish(),
    ownerId: z.string().nullish(),
    projectFilterData: z.lazy(() => ProjectFilterSchema().nullish()),
    projectId: z.string().nullish(),
    shared: z.boolean().nullish(),
    teamId: z.string().nullish()
  })
}

export function CustomViewUpdatedAtSortSchema(): z.ZodObject<Properties<CustomViewUpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerCountSortSchema(): z.ZodObject<Properties<CustomerCountSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerCreateInputSchema(): z.ZodObject<Properties<CustomerCreateInput>> {
  return z.object({
    domains: z.array(z.string()).default([]).nullish(),
    externalIds: z.array(z.string()).default([]).nullish(),
    id: z.string().nullish(),
    logoUrl: z.string().nullish(),
    mainSourceId: z.string().nullish(),
    name: z.string(),
    ownerId: z.string().nullish(),
    revenue: z.number().nullish(),
    size: z.number().nullish(),
    slackChannelId: z.string().nullish(),
    statusId: z.string().nullish(),
    tierId: z.string().nullish()
  })
}

export function CustomerCreatedAtSortSchema(): z.ZodObject<Properties<CustomerCreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerFilterSchema(): z.ZodObject<Properties<CustomerFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomerFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    domains: z.lazy(() => StringArrayComparatorSchema().nullish()),
    externalIds: z.lazy(() => StringArrayComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    or: z.array(z.lazy(() => CustomerFilterSchema())).nullish(),
    owner: z.lazy(() => NullableUserFilterSchema().nullish()),
    revenue: z.lazy(() => NumberComparatorSchema().nullish()),
    size: z.lazy(() => NumberComparatorSchema().nullish()),
    slackChannelId: z.lazy(() => StringComparatorSchema().nullish()),
    status: z.lazy(() => CustomerStatusFilterSchema().nullish()),
    tier: z.lazy(() => CustomerTierFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomerImportantCountSortSchema(): z.ZodObject<Properties<CustomerImportantCountSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerNeedCollectionFilterSchema(): z.ZodObject<Properties<CustomerNeedCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomerNeedCollectionFilterSchema())).nullish(),
    comment: z.lazy(() => NullableCommentFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    customer: z.lazy(() => NullableCustomerFilterSchema().nullish()),
    every: z.lazy(() => CustomerNeedFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    issue: z.lazy(() => NullableIssueFilterSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => CustomerNeedCollectionFilterSchema())).nullish(),
    priority: z.lazy(() => NumberComparatorSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    some: z.lazy(() => CustomerNeedFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomerNeedCreateFromAttachmentInputSchema(): z.ZodObject<Properties<CustomerNeedCreateFromAttachmentInput>> {
  return z.object({
    attachmentId: z.string()
  })
}

export function CustomerNeedCreateInputSchema(): z.ZodObject<Properties<CustomerNeedCreateInput>> {
  return z.object({
    attachmentId: z.string().nullish(),
    attachmentUrl: z.string().nullish(),
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    commentId: z.string().nullish(),
    createAsUser: z.string().nullish(),
    createdAt: z.string().nullish(),
    customerExternalId: z.string().nullish(),
    customerId: z.string().nullish(),
    displayIconUrl: z.string().nullish(),
    id: z.string().nullish(),
    issueId: z.string().nullish(),
    priority: z.number().nullish(),
    projectId: z.string().nullish()
  })
}

export function CustomerNeedFilterSchema(): z.ZodObject<Properties<CustomerNeedFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomerNeedFilterSchema())).nullish(),
    comment: z.lazy(() => NullableCommentFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    customer: z.lazy(() => NullableCustomerFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    issue: z.lazy(() => NullableIssueFilterSchema().nullish()),
    or: z.array(z.lazy(() => CustomerNeedFilterSchema())).nullish(),
    priority: z.lazy(() => NumberComparatorSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomerNeedUpdateInputSchema(): z.ZodObject<Properties<CustomerNeedUpdateInput>> {
  return z.object({
    applyPriorityToRelatedNeeds: z.boolean().nullish(),
    attachmentUrl: z.string().nullish(),
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    customerExternalId: z.string().nullish(),
    customerId: z.string().nullish(),
    id: z.string().nullish(),
    issueId: z.string().nullish(),
    priority: z.number().nullish(),
    projectId: z.string().nullish()
  })
}

export function CustomerRevenueSortSchema(): z.ZodObject<Properties<CustomerRevenueSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerSortSchema(): z.ZodObject<Properties<CustomerSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerSortInputSchema(): z.ZodObject<Properties<CustomerSortInput>> {
  return z.object({
    approximateNeedCount: z.lazy(() => ApproximateNeedCountSortSchema().nullish()),
    createdAt: z.lazy(() => CustomerCreatedAtSortSchema().nullish()),
    name: z.lazy(() => NameSortSchema().nullish()),
    owner: z.lazy(() => OwnerSortSchema().nullish()),
    revenue: z.lazy(() => RevenueSortSchema().nullish()),
    size: z.lazy(() => SizeSortSchema().nullish()),
    status: z.lazy(() => CustomerStatusSortSchema().nullish()),
    tier: z.lazy(() => TierSortSchema().nullish())
  })
}

export function CustomerStatusCreateInputSchema(): z.ZodObject<Properties<CustomerStatusCreateInput>> {
  return z.object({
    color: z.string(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function CustomerStatusFilterSchema(): z.ZodObject<Properties<CustomerStatusFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomerStatusFilterSchema())).nullish(),
    color: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => CustomerStatusFilterSchema())).nullish(),
    position: z.lazy(() => NumberComparatorSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomerStatusSortSchema(): z.ZodObject<Properties<CustomerStatusSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CustomerStatusUpdateInputSchema(): z.ZodObject<Properties<CustomerStatusUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function CustomerTierCreateInputSchema(): z.ZodObject<Properties<CustomerTierCreateInput>> {
  return z.object({
    color: z.string(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function CustomerTierFilterSchema(): z.ZodObject<Properties<CustomerTierFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CustomerTierFilterSchema())).nullish(),
    color: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => StringComparatorSchema().nullish()),
    displayName: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => CustomerTierFilterSchema())).nullish(),
    position: z.lazy(() => NumberComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CustomerTierUpdateInputSchema(): z.ZodObject<Properties<CustomerTierUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function CustomerUpdateInputSchema(): z.ZodObject<Properties<CustomerUpdateInput>> {
  return z.object({
    domains: z.array(z.string()).nullish(),
    externalIds: z.array(z.string()).nullish(),
    logoUrl: z.string().nullish(),
    mainSourceId: z.string().nullish(),
    name: z.string().nullish(),
    ownerId: z.string().nullish(),
    revenue: z.number().nullish(),
    size: z.number().nullish(),
    slackChannelId: z.string().nullish(),
    statusId: z.string().nullish(),
    tierId: z.string().nullish()
  })
}

export function CustomerUpsertInputSchema(): z.ZodObject<Properties<CustomerUpsertInput>> {
  return z.object({
    domains: z.array(z.string()).nullish(),
    externalId: z.string().nullish(),
    id: z.string().nullish(),
    logoUrl: z.string().nullish(),
    name: z.string().nullish(),
    ownerId: z.string().nullish(),
    revenue: z.number().nullish(),
    size: z.number().nullish(),
    slackChannelId: z.string().nullish(),
    statusId: z.string().nullish(),
    tierId: z.string().nullish(),
    tierName: z.string().nullish()
  })
}

export function CustomersAttributesDataSourceConfigurationInputSchema(): z.ZodObject<Properties<CustomersAttributesDataSourceConfigurationInput>> {
  return z.object({
    allowManualEdits: z.boolean().nullish(),
    attributesErrors: z.unknown().nullish(),
    attributesMapping: z.unknown().nullish(),
    integration: z.lazy(() => CustomersAttributesDataSourceIntegrationInputSchema().nullish()),
    sourceType: z.string()
  })
}

export function CustomersAttributesDataSourceIntegrationInputSchema(): z.ZodObject<Properties<CustomersAttributesDataSourceIntegrationInput>> {
  return z.object({
    service: IntegrationServiceSchema
  })
}

export function CustomersConfigurationInputSchema(): z.ZodObject<Properties<CustomersConfigurationInput>> {
  return z.object({
    attributesDataSourceConfiguration: z.lazy(() => CustomersAttributesDataSourceConfigurationInputSchema().nullish()),
    defaultTeamId: z.string().nullish(),
    excludeList: z.array(z.string()).nullish(),
    ignoreList: z.array(z.string()).nullish(),
    revenueCurrencyCode: z.string().nullish(),
    revenueDisplay: z.string().nullish()
  })
}

export function CycleCreateInputSchema(): z.ZodObject<Properties<CycleCreateInput>> {
  return z.object({
    completedAt: z.string().nullish(),
    description: z.string().nullish(),
    endsAt: z.string(),
    id: z.string().nullish(),
    name: z.string().nullish(),
    startsAt: z.string(),
    teamId: z.string()
  })
}

export function CycleFilterSchema(): z.ZodObject<Properties<CycleFilter>> {
  return z.object({
    and: z.array(z.lazy(() => CycleFilterSchema())).nullish(),
    completedAt: z.lazy(() => DateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    endsAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    inheritedFromId: z.lazy(() => IdComparatorSchema().nullish()),
    isActive: z.lazy(() => BooleanComparatorSchema().nullish()),
    isFuture: z.lazy(() => BooleanComparatorSchema().nullish()),
    isInCooldown: z.lazy(() => BooleanComparatorSchema().nullish()),
    isNext: z.lazy(() => BooleanComparatorSchema().nullish()),
    isPast: z.lazy(() => BooleanComparatorSchema().nullish()),
    isPrevious: z.lazy(() => BooleanComparatorSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    number: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => CycleFilterSchema())).nullish(),
    startsAt: z.lazy(() => DateComparatorSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function CyclePeriodComparatorSchema(): z.ZodObject<Properties<CyclePeriodComparator>> {
  return z.object({
    eq: CyclePeriodSchema.nullish(),
    in: z.array(CyclePeriodSchema).nullish(),
    neq: CyclePeriodSchema.nullish(),
    nin: z.array(CyclePeriodSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function CycleShiftAllInputSchema(): z.ZodObject<Properties<CycleShiftAllInput>> {
  return z.object({
    daysToShift: z.number(),
    id: z.string()
  })
}

export function CycleSortSchema(): z.ZodObject<Properties<CycleSort>> {
  return z.object({
    currentCycleFirst: z.boolean().default(false).nullish(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function CycleUpdateInputSchema(): z.ZodObject<Properties<CycleUpdateInput>> {
  return z.object({
    completedAt: z.string().nullish(),
    description: z.string().nullish(),
    endsAt: z.string().nullish(),
    name: z.string().nullish(),
    startsAt: z.string().nullish()
  })
}

export function DateComparatorSchema(): z.ZodObject<Properties<DateComparator>> {
  return z.object({
    eq: z.string().nullish(),
    gt: z.string().nullish(),
    gte: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    lt: z.string().nullish(),
    lte: z.string().nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish()
  })
}

export function DelegateSortSchema(): z.ZodObject<Properties<DelegateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DeleteOrganizationInputSchema(): z.ZodObject<Properties<DeleteOrganizationInput>> {
  return z.object({
    deletionCode: z.string()
  })
}

export function DocumentCreateInputSchema(): z.ZodObject<Properties<DocumentCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    content: z.string().nullish(),
    cycleId: z.string().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    issueId: z.string().nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    projectId: z.string().nullish(),
    releaseId: z.string().nullish(),
    resourceFolderId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    subscriberIds: z.array(z.string()).nullish(),
    teamId: z.string().nullish(),
    title: z.string()
  })
}

export function DocumentCreatedAtSortSchema(): z.ZodObject<Properties<DocumentCreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DocumentCreatorSortSchema(): z.ZodObject<Properties<DocumentCreatorSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DocumentFilterSchema(): z.ZodObject<Properties<DocumentFilter>> {
  return z.object({
    and: z.array(z.lazy(() => DocumentFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    cycle: z.lazy(() => CycleFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => InitiativeFilterSchema().nullish()),
    issue: z.lazy(() => IssueFilterSchema().nullish()),
    or: z.array(z.lazy(() => DocumentFilterSchema())).nullish(),
    project: z.lazy(() => ProjectFilterSchema().nullish()),
    release: z.lazy(() => ReleaseFilterSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    team: z.lazy(() => NullableTeamFilterSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function DocumentProjectSortSchema(): z.ZodObject<Properties<DocumentProjectSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DocumentSortInputSchema(): z.ZodObject<Properties<DocumentSortInput>> {
  return z.object({
    createdAt: z.lazy(() => DocumentCreatedAtSortSchema().nullish()),
    creator: z.lazy(() => DocumentCreatorSortSchema().nullish()),
    project: z.lazy(() => DocumentProjectSortSchema().nullish()),
    title: z.lazy(() => DocumentTitleSortSchema().nullish()),
    updatedAt: z.lazy(() => DocumentUpdatedAtSortSchema().nullish())
  })
}

export function DocumentTitleSortSchema(): z.ZodObject<Properties<DocumentTitleSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DocumentUpdateInputSchema(): z.ZodObject<Properties<DocumentUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    content: z.string().nullish(),
    cycleId: z.string().nullish(),
    hiddenAt: z.string().nullish(),
    icon: z.string().nullish(),
    initiativeId: z.string().nullish(),
    issueId: z.string().nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    projectId: z.string().nullish(),
    releaseId: z.string().nullish(),
    resourceFolderId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    subscriberIds: z.array(z.string()).nullish(),
    teamId: z.string().nullish(),
    title: z.string().nullish(),
    trashed: z.boolean().nullish()
  })
}

export function DocumentUpdatedAtSortSchema(): z.ZodObject<Properties<DocumentUpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function DueDateSortSchema(): z.ZodObject<Properties<DueDateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function EmailIntakeAddressCreateInputSchema(): z.ZodObject<Properties<EmailIntakeAddressCreateInput>> {
  return z.object({
    customerRequestsEnabled: z.boolean().nullish(),
    forwardingEmailAddress: z.string().nullish(),
    id: z.string().nullish(),
    issueCanceledAutoReply: z.string().nullish(),
    issueCanceledAutoReplyEnabled: z.boolean().nullish(),
    issueCompletedAutoReply: z.string().nullish(),
    issueCompletedAutoReplyEnabled: z.boolean().nullish(),
    issueCreatedAutoReply: z.string().nullish(),
    issueCreatedAutoReplyEnabled: z.boolean().nullish(),
    reopenOnReply: z.boolean().nullish(),
    repliesEnabled: z.boolean().nullish(),
    senderName: z.string().nullish(),
    teamId: z.string().nullish(),
    templateId: z.string().nullish(),
    type: EmailIntakeAddressTypeSchema.nullish(),
    useUserNamesInReplies: z.boolean().nullish()
  })
}

export function EmailIntakeAddressUpdateInputSchema(): z.ZodObject<Properties<EmailIntakeAddressUpdateInput>> {
  return z.object({
    customerRequestsEnabled: z.boolean().nullish(),
    enabled: z.boolean().nullish(),
    forwardingEmailAddress: z.string().nullish(),
    issueCanceledAutoReply: z.string().nullish(),
    issueCanceledAutoReplyEnabled: z.boolean().nullish(),
    issueCompletedAutoReply: z.string().nullish(),
    issueCompletedAutoReplyEnabled: z.boolean().nullish(),
    issueCreatedAutoReply: z.string().nullish(),
    issueCreatedAutoReplyEnabled: z.boolean().nullish(),
    reopenOnReply: z.boolean().nullish(),
    repliesEnabled: z.boolean().nullish(),
    senderName: z.string().nullish(),
    teamId: z.string().nullish(),
    templateId: z.string().nullish(),
    useUserNamesInReplies: z.boolean().nullish()
  })
}

export function EmailUnsubscribeInputSchema(): z.ZodObject<Properties<EmailUnsubscribeInput>> {
  return z.object({
    token: z.string(),
    type: z.string(),
    userId: z.string()
  })
}

export function EmailUserAccountAuthChallengeInputSchema(): z.ZodObject<Properties<EmailUserAccountAuthChallengeInput>> {
  return z.object({
    challengeResponse: z.string().nullish(),
    clientAuthCode: z.string().nullish(),
    email: z.string(),
    inviteLink: z.string().nullish(),
    isDesktop: z.boolean().nullish(),
    loginCodeOnly: z.boolean().nullish(),
    sessionId: z.string().nullish()
  })
}

export function EmojiCreateInputSchema(): z.ZodObject<Properties<EmojiCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    name: z.string(),
    url: z.string()
  })
}

export function EntityExternalLinkCreateInputSchema(): z.ZodObject<Properties<EntityExternalLinkCreateInput>> {
  return z.object({
    cycleId: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    label: z.string(),
    projectId: z.string().nullish(),
    releaseId: z.string().nullish(),
    resourceFolderId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    teamId: z.string().nullish(),
    url: z.string()
  })
}

export function EntityExternalLinkUpdateInputSchema(): z.ZodObject<Properties<EntityExternalLinkUpdateInput>> {
  return z.object({
    label: z.string().nullish(),
    resourceFolderId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    url: z.string().nullish()
  })
}

export function EstimateComparatorSchema(): z.ZodObject<Properties<EstimateComparator>> {
  return z.object({
    and: z.array(z.lazy(() => NullableNumberComparatorSchema())).nullish(),
    eq: z.number().nullish(),
    gt: z.number().nullish(),
    gte: z.number().nullish(),
    in: z.array(z.number()).nullish(),
    lt: z.number().nullish(),
    lte: z.number().nullish(),
    neq: z.number().nullish(),
    nin: z.array(z.number()).nullish(),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableNumberComparatorSchema())).nullish()
  })
}

export function EstimateSortSchema(): z.ZodObject<Properties<EstimateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function EventTrackingInputSchema(): z.ZodObject<Properties<EventTrackingInput>> {
  return z.object({
    event: z.string(),
    properties: z.unknown().nullish(),
    sessionId: z.string().nullish()
  })
}

export function FavoriteCreateInputSchema(): z.ZodObject<Properties<FavoriteCreateInput>> {
  return z.object({
    aiConversationId: z.string().nullish(),
    customViewId: z.string().nullish(),
    customerId: z.string().nullish(),
    cycleId: z.string().nullish(),
    dashboardId: z.string().nullish(),
    documentId: z.string().nullish(),
    facetId: z.string().nullish(),
    folderName: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    initiativeLabelId: z.string().nullish(),
    initiativeTab: InitiativeTabSchema.nullish(),
    issueId: z.string().nullish(),
    labelId: z.string().nullish(),
    parentId: z.string().nullish(),
    pipelineTab: PipelineTabSchema.nullish(),
    predefinedViewTeamId: z.string().nullish(),
    predefinedViewType: z.string().nullish(),
    projectId: z.string().nullish(),
    projectLabelId: z.string().nullish(),
    projectTab: ProjectTabSchema.nullish(),
    pullRequestId: z.string().nullish(),
    releaseId: z.string().nullish(),
    releaseNoteId: z.string().nullish(),
    releasePipelineId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    teamId: z.string().nullish(),
    userId: z.string().nullish()
  })
}

export function FavoriteUpdateInputSchema(): z.ZodObject<Properties<FavoriteUpdateInput>> {
  return z.object({
    folderName: z.string().nullish(),
    parentId: z.string().nullish(),
    sortOrder: z.number().nullish()
  })
}

export function FeedItemFilterSchema(): z.ZodObject<Properties<FeedItemFilter>> {
  return z.object({
    and: z.array(z.lazy(() => FeedItemFilterSchema())).nullish(),
    author: z.lazy(() => UserFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => FeedItemFilterSchema())).nullish(),
    projectUpdate: z.lazy(() => ProjectUpdateFilterSchema().nullish()),
    relatedInitiatives: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    relatedTeams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    updateHealth: z.lazy(() => StringComparatorSchema().nullish()),
    updateType: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function FrontSettingsInputSchema(): z.ZodObject<Properties<FrontSettingsInput>> {
  return z.object({
    automateTicketReopeningOnCancellation: z.boolean().nullish(),
    automateTicketReopeningOnComment: z.boolean().nullish(),
    automateTicketReopeningOnCompletion: z.boolean().nullish(),
    automateTicketReopeningOnProjectCancellation: z.boolean().nullish(),
    automateTicketReopeningOnProjectCompletion: z.boolean().nullish(),
    disableCustomerRequestsAutoCreation: z.boolean().nullish(),
    enableAiIntake: z.boolean().nullish(),
    sendNoteOnComment: z.boolean().nullish(),
    sendNoteOnStatusChange: z.boolean().nullish()
  })
}

export function GitAutomationStateCreateInputSchema(): z.ZodObject<Properties<GitAutomationStateCreateInput>> {
  return z.object({
    event: GitAutomationStatesSchema,
    id: z.string().nullish(),
    stateId: z.string().nullish(),
    targetBranchId: z.string().nullish(),
    teamId: z.string()
  })
}

export function GitAutomationStateUpdateInputSchema(): z.ZodObject<Properties<GitAutomationStateUpdateInput>> {
  return z.object({
    event: GitAutomationStatesSchema.nullish(),
    stateId: z.string().nullish(),
    targetBranchId: z.string().nullish()
  })
}

export function GitAutomationTargetBranchCreateInputSchema(): z.ZodObject<Properties<GitAutomationTargetBranchCreateInput>> {
  return z.object({
    branchPattern: z.string(),
    id: z.string().nullish(),
    isRegex: z.boolean().default(false).nullish(),
    teamId: z.string()
  })
}

export function GitAutomationTargetBranchUpdateInputSchema(): z.ZodObject<Properties<GitAutomationTargetBranchUpdateInput>> {
  return z.object({
    branchPattern: z.string().nullish(),
    isRegex: z.boolean().nullish()
  })
}

export function GitHubImportSettingsInputSchema(): z.ZodObject<Properties<GitHubImportSettingsInput>> {
  return z.object({
    labels: z.unknown().nullish(),
    orgAvatarUrl: z.string(),
    orgLogin: z.string(),
    orgType: GithubOrgTypeSchema,
    repositories: z.array(z.lazy(() => GitHubRepoInputSchema()))
  })
}

export function GitHubPersonalSettingsInputSchema(): z.ZodObject<Properties<GitHubPersonalSettingsInput>> {
  return z.object({
    login: z.string()
  })
}

export function GitHubRepoInputSchema(): z.ZodObject<Properties<GitHubRepoInput>> {
  return z.object({
    archived: z.boolean().nullish(),
    description: z.string().nullish(),
    externalId: z.string().nullish(),
    fullName: z.string(),
    id: z.number()
  })
}

export function GitHubRepoMappingInputSchema(): z.ZodObject<Properties<GitHubRepoMappingInput>> {
  return z.object({
    bidirectional: z.boolean().nullish(),
    default: z.boolean().nullish(),
    gitHubLabels: z.array(z.string()).nullish(),
    gitHubRepoId: z.number(),
    id: z.string(),
    linearTeamId: z.string()
  })
}

export function GitHubSettingsInputSchema(): z.ZodObject<Properties<GitHubSettingsInput>> {
  return z.object({
    codeAccess: z.boolean().nullish(),
    enterpriseUrl: z.string().nullish(),
    externalOrgId: z.string().nullish(),
    orgAvatarUrl: z.string().nullish(),
    orgLogin: z.string(),
    orgType: GithubOrgTypeSchema.nullish(),
    pullRequestReviewTool: PullRequestReviewToolSchema.nullish(),
    repositories: z.array(z.lazy(() => GitHubRepoInputSchema())).nullish(),
    repositoriesMapping: z.array(z.lazy(() => GitHubRepoMappingInputSchema())).nullish()
  })
}

export function GitLabSettingsInputSchema(): z.ZodObject<Properties<GitLabSettingsInput>> {
  return z.object({
    expiresAt: z.string().nullish(),
    readonly: z.boolean().nullish(),
    url: z.string().nullish(),
    useRestPrSync: z.boolean().nullish(),
    validationProjectPath: z.string().nullish()
  })
}

export function GongRecordingImportConfigInputSchema(): z.ZodObject<Properties<GongRecordingImportConfigInput>> {
  return z.object({
    teamId: z.string().nullish()
  })
}

export function GongSettingsInputSchema(): z.ZodObject<Properties<GongSettingsInput>> {
  return z.object({
    importConfig: z.lazy(() => GongRecordingImportConfigInputSchema().nullish()),
    tagParticipantsInIssues: z.boolean().nullish()
  })
}

export function GoogleSheetsExportSettingsSchema(): z.ZodObject<Properties<GoogleSheetsExportSettings>> {
  return z.object({
    enabled: z.boolean().nullish(),
    sheetId: z.number().nullish(),
    spreadsheetId: z.string().nullish(),
    spreadsheetUrl: z.string().nullish(),
    updatedAt: z.string().nullish()
  })
}

export function GoogleSheetsSettingsInputSchema(): z.ZodObject<Properties<GoogleSheetsSettingsInput>> {
  return z.object({
    initiative: z.lazy(() => GoogleSheetsExportSettingsSchema().nullish()),
    issue: z.lazy(() => GoogleSheetsExportSettingsSchema().nullish()),
    project: z.lazy(() => GoogleSheetsExportSettingsSchema().nullish()),
    sheetId: z.number().nullish(),
    spreadsheetId: z.string().nullish(),
    spreadsheetUrl: z.string().nullish(),
    updatedIssuesAt: z.string().nullish()
  })
}

export function GoogleUserAccountAuthInputSchema(): z.ZodObject<Properties<GoogleUserAccountAuthInput>> {
  return z.object({
    code: z.string(),
    disallowSignup: z.boolean().nullish(),
    inviteLink: z.string().nullish(),
    redirectUri: z.string().nullish(),
    sessionId: z.string().nullish(),
    timezone: z.string()
  })
}

export function IdComparatorSchema(): z.ZodObject<Properties<IdComparator>> {
  return z.object({
    eq: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish()
  })
}

export function InheritanceEntityMappingSchema(): z.ZodObject<Properties<InheritanceEntityMapping>> {
  return z.object({
    issueLabels: z.unknown().nullish(),
    workflowStates: z.unknown()
  })
}

export function InitiativeCollectionFilterSchema(): z.ZodObject<Properties<InitiativeCollectionFilter>> {
  return z.object({
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    ancestors: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => InitiativeCollectionFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    every: z.lazy(() => InitiativeFilterSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiativeUpdates: z.lazy(() => InitiativeUpdatesCollectionFilterSchema().nullish()),
    labels: z.lazy(() => InitiativeLabelCollectionFilterSchema().nullish()),
    leadTeam: z.lazy(() => NullableTeamFilterSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeCollectionFilterSchema())).nullish(),
    owner: z.lazy(() => NullableUserFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    some: z.lazy(() => InitiativeFilterSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    status: z.lazy(() => StringComparatorSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    teams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function InitiativeCreateInputSchema(): z.ZodObject<Properties<InitiativeCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    content: z.string().nullish(),
    description: z.string().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    leadTeamId: z.string().nullish(),
    name: z.string(),
    ownerId: z.string().nullish(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    sortOrder: z.number().nullish(),
    status: InitiativeStatusSchema.nullish(),
    targetDate: z.string().nullish(),
    targetDateResolution: DateResolutionTypeSchema.nullish()
  })
}

export function InitiativeCreatedAtSortSchema(): z.ZodObject<Properties<InitiativeCreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeFilterSchema(): z.ZodObject<Properties<InitiativeFilter>> {
  return z.object({
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    ancestors: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => InitiativeFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiativeUpdates: z.lazy(() => InitiativeUpdatesCollectionFilterSchema().nullish()),
    labels: z.lazy(() => InitiativeLabelCollectionFilterSchema().nullish()),
    leadTeam: z.lazy(() => NullableTeamFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeFilterSchema())).nullish(),
    owner: z.lazy(() => NullableUserFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    status: z.lazy(() => StringComparatorSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    teams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function InitiativeHealthSortSchema(): z.ZodObject<Properties<InitiativeHealthSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeHealthUpdatedAtSortSchema(): z.ZodObject<Properties<InitiativeHealthUpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeLabelCollectionFilterSchema(): z.ZodObject<Properties<InitiativeLabelCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => InitiativeLabelCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    every: z.lazy(() => InitiativeLabelFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => InitiativeLabelCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => InitiativeLabelFilterSchema().nullish()),
    some: z.lazy(() => InitiativeLabelCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function InitiativeLabelCreateInputSchema(): z.ZodObject<Properties<InitiativeLabelCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish()
  })
}

export function InitiativeLabelFilterSchema(): z.ZodObject<Properties<InitiativeLabelFilter>> {
  return z.object({
    and: z.array(z.lazy(() => InitiativeLabelFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeLabelFilterSchema())).nullish(),
    parent: z.lazy(() => InitiativeLabelFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function InitiativeLabelUpdateInputSchema(): z.ZodObject<Properties<InitiativeLabelUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string().nullish(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish()
  })
}

export function InitiativeManualSortSchema(): z.ZodObject<Properties<InitiativeManualSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeNameSortSchema(): z.ZodObject<Properties<InitiativeNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeOwnerSortSchema(): z.ZodObject<Properties<InitiativeOwnerSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativePrioritySortSchema(): z.ZodObject<Properties<InitiativePrioritySort>> {
  return z.object({
    noPriorityFirst: z.boolean().default(false).nullish(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeRelationCreateInputSchema(): z.ZodObject<Properties<InitiativeRelationCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    initiativeId: z.string(),
    relatedInitiativeId: z.string(),
    sortOrder: z.number().nullish()
  })
}

export function InitiativeRelationUpdateInputSchema(): z.ZodObject<Properties<InitiativeRelationUpdateInput>> {
  return z.object({
    sortOrder: z.number().nullish()
  })
}

export function InitiativeSortInputSchema(): z.ZodObject<Properties<InitiativeSortInput>> {
  return z.object({
    createdAt: z.lazy(() => InitiativeCreatedAtSortSchema().nullish()),
    health: z.lazy(() => InitiativeHealthSortSchema().nullish()),
    healthUpdatedAt: z.lazy(() => InitiativeHealthUpdatedAtSortSchema().nullish()),
    manual: z.lazy(() => InitiativeManualSortSchema().nullish()),
    name: z.lazy(() => InitiativeNameSortSchema().nullish()),
    owner: z.lazy(() => InitiativeOwnerSortSchema().nullish()),
    priority: z.lazy(() => InitiativePrioritySortSchema().nullish()),
    targetDate: z.lazy(() => InitiativeTargetDateSortSchema().nullish()),
    updatedAt: z.lazy(() => InitiativeUpdatedAtSortSchema().nullish())
  })
}

export function InitiativeTargetDateSortSchema(): z.ZodObject<Properties<InitiativeTargetDateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeToProjectCreateInputSchema(): z.ZodObject<Properties<InitiativeToProjectCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    initiativeId: z.string(),
    projectId: z.string(),
    sortOrder: z.number().nullish()
  })
}

export function InitiativeToProjectUpdateInputSchema(): z.ZodObject<Properties<InitiativeToProjectUpdateInput>> {
  return z.object({
    sortOrder: z.number().nullish()
  })
}

export function InitiativeUpdateCreateInputSchema(): z.ZodObject<Properties<InitiativeUpdateCreateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    health: InitiativeUpdateHealthTypeSchema.nullish(),
    id: z.string().nullish(),
    initiativeId: z.string(),
    isDiffHidden: z.boolean().nullish()
  })
}

export function InitiativeUpdateFilterSchema(): z.ZodObject<Properties<InitiativeUpdateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => InitiativeUpdateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => InitiativeFilterSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeUpdateFilterSchema())).nullish(),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function InitiativeUpdateInputSchema(): z.ZodObject<Properties<InitiativeUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    content: z.string().nullish(),
    customIdentifier: z.string().nullish(),
    description: z.string().nullish(),
    frequencyResolution: FrequencyResolutionTypeSchema.nullish(),
    icon: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    leadTeamId: z.string().nullish(),
    name: z.string().nullish(),
    ownerId: z.string().nullish(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    sortOrder: z.number().nullish(),
    status: InitiativeStatusSchema.nullish(),
    targetDate: z.string().nullish(),
    targetDateResolution: DateResolutionTypeSchema.nullish(),
    trashed: z.boolean().nullish(),
    updateReminderFrequency: z.number().nullish(),
    updateReminderFrequencyInWeeks: z.number().nullish(),
    updateRemindersDay: DaySchema.nullish(),
    updateRemindersHour: z.number().nullish()
  })
}

export function InitiativeUpdateUpdateInputSchema(): z.ZodObject<Properties<InitiativeUpdateUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    health: InitiativeUpdateHealthTypeSchema.nullish()
  })
}

export function InitiativeUpdatedAtSortSchema(): z.ZodObject<Properties<InitiativeUpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function InitiativeUpdatesCollectionFilterSchema(): z.ZodObject<Properties<InitiativeUpdatesCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => InitiativeUpdatesCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => InitiativeUpdatesFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeUpdatesCollectionFilterSchema())).nullish(),
    some: z.lazy(() => InitiativeUpdatesFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function InitiativeUpdatesFilterSchema(): z.ZodObject<Properties<InitiativeUpdatesFilter>> {
  return z.object({
    and: z.array(z.lazy(() => InitiativeUpdatesFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => InitiativeUpdatesFilterSchema())).nullish(),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IntegrationCustomerDataAttributesRefreshInputSchema(): z.ZodObject<Properties<IntegrationCustomerDataAttributesRefreshInput>> {
  return z.object({
    service: z.string()
  })
}

export function IntegrationRequestInputSchema(): z.ZodObject<Properties<IntegrationRequestInput>> {
  return z.object({
    email: z.string().nullish(),
    name: z.string()
  })
}

export function IntegrationSettingsInputSchema(): z.ZodObject<Properties<IntegrationSettingsInput>> {
  return z.object({
    front: z.lazy(() => FrontSettingsInputSchema().nullish()),
    gitHub: z.lazy(() => GitHubSettingsInputSchema().nullish()),
    gitHubImport: z.lazy(() => GitHubImportSettingsInputSchema().nullish()),
    gitHubPersonal: z.lazy(() => GitHubPersonalSettingsInputSchema().nullish()),
    gitLab: z.lazy(() => GitLabSettingsInputSchema().nullish()),
    gong: z.lazy(() => GongSettingsInputSchema().nullish()),
    googleSheets: z.lazy(() => GoogleSheetsSettingsInputSchema().nullish()),
    intercom: z.lazy(() => IntercomSettingsInputSchema().nullish()),
    jira: z.lazy(() => JiraSettingsInputSchema().nullish()),
    jiraPersonal: z.lazy(() => JiraPersonalSettingsInputSchema().nullish()),
    launchDarkly: z.lazy(() => LaunchDarklySettingsInputSchema().nullish()),
    microsoftTeams: z.lazy(() => MicrosoftTeamsSettingsInputSchema().nullish()),
    microsoftTeamsProjectPost: z.lazy(() => MicrosoftTeamsPostSettingsInputSchema().nullish()),
    notion: z.lazy(() => NotionSettingsInputSchema().nullish()),
    opsgenie: z.lazy(() => OpsgenieInputSchema().nullish()),
    pagerDuty: z.lazy(() => PagerDutyInputSchema().nullish()),
    salesforce: z.lazy(() => SalesforceSettingsInputSchema().nullish()),
    sentry: z.lazy(() => SentrySettingsInputSchema().nullish()),
    slack: z.lazy(() => SlackSettingsInputSchema().nullish()),
    slackAsks: z.lazy(() => SlackAsksSettingsInputSchema().nullish()),
    slackCustomViewNotifications: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    slackInitiativePost: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    slackOrgInitiativeUpdatesPost: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    slackOrgProjectUpdatesPost: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    slackPost: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    slackProjectPost: z.lazy(() => SlackPostSettingsInputSchema().nullish()),
    zendesk: z.lazy(() => ZendeskSettingsInputSchema().nullish())
  })
}

export function IntegrationTemplateCreateInputSchema(): z.ZodObject<Properties<IntegrationTemplateCreateInput>> {
  return z.object({
    foreignEntityId: z.string().nullish(),
    id: z.string().nullish(),
    integrationId: z.string(),
    templateId: z.string()
  })
}

export function IntegrationUpdateInputSchema(): z.ZodObject<Properties<IntegrationUpdateInput>> {
  return z.object({
    settings: z.lazy(() => IntegrationSettingsInputSchema().nullish()),
    workflowDefinitionDraftId: z.string().nullish(),
    workflowDefinitionId: z.string().nullish()
  })
}

export function IntegrationsSettingsCreateInputSchema(): z.ZodObject<Properties<IntegrationsSettingsCreateInput>> {
  return z.object({
    contextViewType: ContextViewTypeSchema.nullish(),
    customViewId: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    microsoftTeamsProjectUpdateCreated: z.boolean().nullish(),
    projectId: z.string().nullish(),
    slackInitiativeUpdateCreated: z.boolean().nullish(),
    slackIssueAddedToTriage: z.boolean().nullish(),
    slackIssueAddedToView: z.boolean().nullish(),
    slackIssueCreated: z.boolean().nullish(),
    slackIssueNewComment: z.boolean().nullish(),
    slackIssueSlaBreached: z.boolean().nullish(),
    slackIssueSlaHighRisk: z.boolean().nullish(),
    slackIssueStatusChangedAll: z.boolean().nullish(),
    slackIssueStatusChangedDone: z.boolean().nullish(),
    slackProjectUpdateCreated: z.boolean().nullish(),
    slackProjectUpdateCreatedToTeam: z.boolean().nullish(),
    slackProjectUpdateCreatedToWorkspace: z.boolean().nullish(),
    teamId: z.string().nullish()
  })
}

export function IntegrationsSettingsUpdateInputSchema(): z.ZodObject<Properties<IntegrationsSettingsUpdateInput>> {
  return z.object({
    microsoftTeamsProjectUpdateCreated: z.boolean().nullish(),
    slackInitiativeUpdateCreated: z.boolean().nullish(),
    slackIssueAddedToTriage: z.boolean().nullish(),
    slackIssueAddedToView: z.boolean().nullish(),
    slackIssueCreated: z.boolean().nullish(),
    slackIssueNewComment: z.boolean().nullish(),
    slackIssueSlaBreached: z.boolean().nullish(),
    slackIssueSlaHighRisk: z.boolean().nullish(),
    slackIssueStatusChangedAll: z.boolean().nullish(),
    slackIssueStatusChangedDone: z.boolean().nullish(),
    slackProjectUpdateCreated: z.boolean().nullish(),
    slackProjectUpdateCreatedToTeam: z.boolean().nullish(),
    slackProjectUpdateCreatedToWorkspace: z.boolean().nullish()
  })
}

export function IntercomSettingsInputSchema(): z.ZodObject<Properties<IntercomSettingsInput>> {
  return z.object({
    automateTicketReopeningOnCancellation: z.boolean().nullish(),
    automateTicketReopeningOnComment: z.boolean().nullish(),
    automateTicketReopeningOnCompletion: z.boolean().nullish(),
    automateTicketReopeningOnProjectCancellation: z.boolean().nullish(),
    automateTicketReopeningOnProjectCompletion: z.boolean().nullish(),
    automaticConversationIntakeTeamId: z.string().nullish(),
    disableCustomerRequestsAutoCreation: z.boolean().nullish(),
    enableAiIntake: z.boolean().nullish(),
    enableAiIntakeAttachmentProcessing: z.boolean().nullish(),
    enableAutomaticConversationIntake: z.boolean().nullish(),
    sendNoteOnComment: z.boolean().nullish(),
    sendNoteOnStatusChange: z.boolean().nullish()
  })
}

export function IssueBatchCreateInputSchema(): z.ZodObject<Properties<IssueBatchCreateInput>> {
  return z.object({
    issues: z.array(z.lazy(() => IssueCreateInputSchema()))
  })
}

export function IssueCollectionFilterSchema(): z.ZodObject<Properties<IssueCollectionFilter>> {
  return z.object({
    accumulatedStateUpdatedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    activity: z.lazy(() => ActivityCollectionFilterSchema().nullish()),
    addedToCycleAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    addedToCyclePeriod: z.lazy(() => CyclePeriodComparatorSchema().nullish()),
    ageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    and: z.array(z.lazy(() => IssueCollectionFilterSchema())).nullish(),
    archivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    assignee: z.lazy(() => NullableUserFilterSchema().nullish()),
    attachments: z.lazy(() => AttachmentCollectionFilterSchema().nullish()),
    autoArchivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    autoClosedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    children: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    comments: z.lazy(() => CommentCollectionFilterSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    cycle: z.lazy(() => NullableCycleFilterSchema().nullish()),
    cycleTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    delegate: z.lazy(() => NullableUserFilterSchema().nullish()),
    description: z.lazy(() => NullableStringComparatorSchema().nullish()),
    dueDate: z.lazy(() => NullableTimelessDateComparatorSchema().nullish()),
    estimate: z.lazy(() => EstimateComparatorSchema().nullish()),
    every: z.lazy(() => IssueFilterSchema().nullish()),
    hasActiveAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDismissedAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDuplicateRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasErroredAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasMergedAgentPullRequests: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSharedUsers: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedAssignees: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedLabels: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedProjects: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedRelatedIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedSimilarIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedTeams: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    id: z.lazy(() => IssueIdComparatorSchema().nullish()),
    labels: z.lazy(() => IssueLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    leadTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    number: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => IssueCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => NullableIssueFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectMilestone: z.lazy(() => NullableProjectMilestoneFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    recurringIssueTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    releases: z.lazy(() => ReleaseCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    sharedWith: z.lazy(() => UserCollectionFilterSchema().nullish()),
    slaBreachesAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    slaStatus: z.lazy(() => SlaStatusComparatorSchema().nullish()),
    snoozedBy: z.lazy(() => NullableUserFilterSchema().nullish()),
    snoozedUntilAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    some: z.lazy(() => IssueFilterSchema().nullish()),
    sourceMetadata: z.lazy(() => SourceMetadataComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => WorkflowStateFilterSchema().nullish()),
    subscribers: z.lazy(() => UserCollectionFilterSchema().nullish()),
    suggestions: z.lazy(() => IssueSuggestionCollectionFilterSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    triageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    triagedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueCreateInputSchema(): z.ZodObject<Properties<IssueCreateInput>> {
  return z.object({
    assigneeId: z.string().nullish(),
    completedAt: z.string().nullish(),
    createAsUser: z.string().nullish(),
    createdAt: z.string().nullish(),
    cycleId: z.string().nullish(),
    delegateId: z.string().nullish(),
    description: z.string().nullish(),
    descriptionData: z.unknown().nullish(),
    displayIconUrl: z.string().nullish(),
    dueDate: z.string().nullish(),
    estimate: z.number().nullish(),
    id: z.string().nullish(),
    inheritsSharedAccess: z.boolean().nullish(),
    labelIds: z.array(z.string()).nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    parentId: z.string().nullish(),
    preserveSortOrderOnCreate: z.boolean().nullish(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    projectId: z.string().nullish(),
    projectMilestoneId: z.string().nullish(),
    referenceCommentId: z.string().nullish(),
    releaseIds: z.array(z.string()).nullish(),
    slaBreachesAt: z.string().nullish(),
    slaStartedAt: z.string().nullish(),
    slaType: SlaDayCountTypeSchema.nullish(),
    sortOrder: z.number().nullish(),
    sourceCommentId: z.string().nullish(),
    sourcePullRequestCommentId: z.string().nullish(),
    stateId: z.string().nullish(),
    subIssueSortOrder: z.number().nullish(),
    subscriberIds: z.array(z.string()).nullish(),
    teamId: z.string(),
    templateId: z.string().nullish(),
    title: z.string().nullish(),
    useDefaultTemplate: z.boolean().nullish()
  })
}

export function IssueFilterSchema(): z.ZodObject<Properties<IssueFilter>> {
  return z.object({
    accumulatedStateUpdatedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    activity: z.lazy(() => ActivityCollectionFilterSchema().nullish()),
    addedToCycleAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    addedToCyclePeriod: z.lazy(() => CyclePeriodComparatorSchema().nullish()),
    ageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    and: z.array(z.lazy(() => IssueFilterSchema())).nullish(),
    archivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    assignee: z.lazy(() => NullableUserFilterSchema().nullish()),
    attachments: z.lazy(() => AttachmentCollectionFilterSchema().nullish()),
    autoArchivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    autoClosedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    children: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    comments: z.lazy(() => CommentCollectionFilterSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    cycle: z.lazy(() => NullableCycleFilterSchema().nullish()),
    cycleTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    delegate: z.lazy(() => NullableUserFilterSchema().nullish()),
    description: z.lazy(() => NullableStringComparatorSchema().nullish()),
    dueDate: z.lazy(() => NullableTimelessDateComparatorSchema().nullish()),
    estimate: z.lazy(() => EstimateComparatorSchema().nullish()),
    hasActiveAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDismissedAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDuplicateRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasErroredAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasMergedAgentPullRequests: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSharedUsers: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedAssignees: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedLabels: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedProjects: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedRelatedIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedSimilarIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedTeams: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    id: z.lazy(() => IssueIdComparatorSchema().nullish()),
    labels: z.lazy(() => IssueLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    leadTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    number: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => IssueFilterSchema())).nullish(),
    parent: z.lazy(() => NullableIssueFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectMilestone: z.lazy(() => NullableProjectMilestoneFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    recurringIssueTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    releases: z.lazy(() => ReleaseCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    sharedWith: z.lazy(() => UserCollectionFilterSchema().nullish()),
    slaBreachesAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    slaStatus: z.lazy(() => SlaStatusComparatorSchema().nullish()),
    snoozedBy: z.lazy(() => NullableUserFilterSchema().nullish()),
    snoozedUntilAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    sourceMetadata: z.lazy(() => SourceMetadataComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => WorkflowStateFilterSchema().nullish()),
    subscribers: z.lazy(() => UserCollectionFilterSchema().nullish()),
    suggestions: z.lazy(() => IssueSuggestionCollectionFilterSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    triageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    triagedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueIdComparatorSchema(): z.ZodObject<Properties<IssueIdComparator>> {
  return z.object({
    eq: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish()
  })
}

export function IssueImportUpdateInputSchema(): z.ZodObject<Properties<IssueImportUpdateInput>> {
  return z.object({
    mapping: z.unknown()
  })
}

export function IssueLabelCollectionFilterSchema(): z.ZodObject<Properties<IssueLabelCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => IssueLabelCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    every: z.lazy(() => IssueLabelFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => IssueLabelCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => IssueLabelFilterSchema().nullish()),
    some: z.lazy(() => IssueLabelFilterSchema().nullish()),
    team: z.lazy(() => NullableTeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueLabelCreateInputSchema(): z.ZodObject<Properties<IssueLabelCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish(),
    teamId: z.string().nullish()
  })
}

export function IssueLabelFilterSchema(): z.ZodObject<Properties<IssueLabelFilter>> {
  return z.object({
    and: z.array(z.lazy(() => IssueLabelFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => IssueLabelFilterSchema())).nullish(),
    parent: z.lazy(() => IssueLabelFilterSchema().nullish()),
    team: z.lazy(() => NullableTeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueLabelUpdateInputSchema(): z.ZodObject<Properties<IssueLabelUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string().nullish(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish()
  })
}

export function IssueReferenceInputSchema(): z.ZodObject<Properties<IssueReferenceInput>> {
  return z.object({
    commitSha: z.string(),
    identifier: z.string()
  })
}

export function IssueRelationCreateInputSchema(): z.ZodObject<Properties<IssueRelationCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    issueId: z.string(),
    relatedIssueId: z.string(),
    type: IssueRelationTypeSchema
  })
}

export function IssueRelationUpdateInputSchema(): z.ZodObject<Properties<IssueRelationUpdateInput>> {
  return z.object({
    issueId: z.string().nullish(),
    relatedIssueId: z.string().nullish(),
    type: z.string().nullish()
  })
}

export function IssueSortInputSchema(): z.ZodObject<Properties<IssueSortInput>> {
  return z.object({
    accumulatedStateUpdatedAt: z.lazy(() => TimeInStatusSortSchema().nullish()),
    assignee: z.lazy(() => AssigneeSortSchema().nullish()),
    completedAt: z.lazy(() => CompletedAtSortSchema().nullish()),
    createdAt: z.lazy(() => CreatedAtSortSchema().nullish()),
    customer: z.lazy(() => CustomerSortSchema().nullish()),
    customerCount: z.lazy(() => CustomerCountSortSchema().nullish()),
    customerImportantCount: z.lazy(() => CustomerImportantCountSortSchema().nullish()),
    customerRevenue: z.lazy(() => CustomerRevenueSortSchema().nullish()),
    cycle: z.lazy(() => CycleSortSchema().nullish()),
    delegate: z.lazy(() => DelegateSortSchema().nullish()),
    dueDate: z.lazy(() => DueDateSortSchema().nullish()),
    estimate: z.lazy(() => EstimateSortSchema().nullish()),
    label: z.lazy(() => LabelSortSchema().nullish()),
    labelGroup: z.lazy(() => LabelGroupSortSchema().nullish()),
    linkCount: z.lazy(() => LinkCountSortSchema().nullish()),
    manual: z.lazy(() => ManualSortSchema().nullish()),
    milestone: z.lazy(() => MilestoneSortSchema().nullish()),
    priority: z.lazy(() => PrioritySortSchema().nullish()),
    project: z.lazy(() => ProjectSortSchema().nullish()),
    release: z.lazy(() => ReleaseSortSchema().nullish()),
    rootIssue: z.lazy(() => RootIssueSortSchema().nullish()),
    slaStatus: z.lazy(() => SlaStatusSortSchema().nullish()),
    team: z.lazy(() => TeamSortSchema().nullish()),
    title: z.lazy(() => TitleSortSchema().nullish()),
    updatedAt: z.lazy(() => UpdatedAtSortSchema().nullish()),
    workflowState: z.lazy(() => WorkflowStateSortSchema().nullish())
  })
}

export function IssueSubscriptionFilterSchema(): z.ZodObject<Properties<IssueSubscriptionFilter>> {
  return z.object({
    assigneeId: z.lazy(() => IdComparatorSchema().nullish()),
    parentId: z.lazy(() => IdComparatorSchema().nullish()),
    projectId: z.lazy(() => IdComparatorSchema().nullish()),
    stateId: z.lazy(() => IdComparatorSchema().nullish()),
    teamId: z.lazy(() => IdComparatorSchema().nullish())
  })
}

export function IssueSuggestionCollectionFilterSchema(): z.ZodObject<Properties<IssueSuggestionCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => IssueSuggestionCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => IssueSuggestionFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => IssueSuggestionCollectionFilterSchema())).nullish(),
    some: z.lazy(() => IssueSuggestionFilterSchema().nullish()),
    state: z.lazy(() => StringComparatorSchema().nullish()),
    suggestedLabel: z.lazy(() => IssueLabelFilterSchema().nullish()),
    suggestedProject: z.lazy(() => NullableProjectFilterSchema().nullish()),
    suggestedTeam: z.lazy(() => NullableTeamFilterSchema().nullish()),
    suggestedUser: z.lazy(() => NullableUserFilterSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueSuggestionFilterSchema(): z.ZodObject<Properties<IssueSuggestionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => IssueSuggestionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => IssueSuggestionFilterSchema())).nullish(),
    state: z.lazy(() => StringComparatorSchema().nullish()),
    suggestedLabel: z.lazy(() => IssueLabelFilterSchema().nullish()),
    suggestedProject: z.lazy(() => NullableProjectFilterSchema().nullish()),
    suggestedTeam: z.lazy(() => NullableTeamFilterSchema().nullish()),
    suggestedUser: z.lazy(() => NullableUserFilterSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function IssueToReleaseCreateInputSchema(): z.ZodObject<Properties<IssueToReleaseCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    issueId: z.string(),
    releaseId: z.string()
  })
}

export function IssueUpdateInputSchema(): z.ZodObject<Properties<IssueUpdateInput>> {
  return z.object({
    addedLabelIds: z.array(z.string()).nullish(),
    addedReleaseIds: z.array(z.string()).nullish(),
    assigneeId: z.string().nullish(),
    autoClosedByParentClosing: z.boolean().nullish(),
    cycleId: z.string().nullish(),
    delegateId: z.string().nullish(),
    description: z.string().nullish(),
    descriptionData: z.unknown().nullish(),
    dueDate: z.string().nullish(),
    estimate: z.number().nullish(),
    inheritsSharedAccess: z.boolean().nullish(),
    labelIds: z.array(z.string()).nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    parentId: z.string().nullish(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    projectId: z.string().nullish(),
    projectMilestoneId: z.string().nullish(),
    releaseIds: z.array(z.string()).nullish(),
    removedLabelIds: z.array(z.string()).nullish(),
    removedReleaseIds: z.array(z.string()).nullish(),
    slaBreachesAt: z.string().nullish(),
    slaStartedAt: z.string().nullish(),
    slaType: SlaDayCountTypeSchema.nullish(),
    snoozedById: z.string().nullish(),
    snoozedUntilAt: z.string().nullish(),
    sortOrder: z.number().nullish(),
    stateId: z.string().nullish(),
    subIssueSortOrder: z.number().nullish(),
    subscriberIds: z.array(z.string()).nullish(),
    teamId: z.string().nullish(),
    title: z.string().nullish(),
    trashed: z.boolean().nullish(),
    trusted: z.boolean().nullish()
  })
}

export function JiraConfigurationInputSchema(): z.ZodObject<Properties<JiraConfigurationInput>> {
  return z.object({
    accessToken: z.string(),
    email: z.string(),
    hostname: z.string(),
    manualSetup: z.boolean().nullish()
  })
}

export function JiraFetchProjectStatusesInputSchema(): z.ZodObject<Properties<JiraFetchProjectStatusesInput>> {
  return z.object({
    integrationId: z.string(),
    projectId: z.string()
  })
}

export function JiraLinearMappingInputSchema(): z.ZodObject<Properties<JiraLinearMappingInput>> {
  return z.object({
    bidirectional: z.boolean().nullish(),
    default: z.boolean().nullish(),
    jiraProjectId: z.string(),
    legacyUnidirectional: z.boolean().nullish(),
    linearTeamId: z.string()
  })
}

export function JiraPersonalSettingsInputSchema(): z.ZodObject<Properties<JiraPersonalSettingsInput>> {
  return z.object({
    siteName: z.string().nullish()
  })
}

export function JiraProjectDataInputSchema(): z.ZodObject<Properties<JiraProjectDataInput>> {
  return z.object({
    id: z.string(),
    key: z.string(),
    name: z.string()
  })
}

export function JiraSettingsInputSchema(): z.ZodObject<Properties<JiraSettingsInput>> {
  return z.object({
    customOAuthServerUrl: z.string().nullish(),
    isCustomOAuth: z.boolean().nullish(),
    isJiraServer: z.boolean().default(false).nullish(),
    label: z.string().nullish(),
    manualSetup: z.boolean().nullish(),
    personalOAuthClientId: z.string().nullish(),
    projectMapping: z.array(z.lazy(() => JiraLinearMappingInputSchema())).nullish(),
    projects: z.array(z.lazy(() => JiraProjectDataInputSchema())),
    setupPending: z.boolean().nullish(),
    statusNamesPerIssueType: z.unknown().nullish()
  })
}

export function JiraUpdateInputSchema(): z.ZodObject<Properties<JiraUpdateInput>> {
  return z.object({
    accessToken: z.string().nullish(),
    deleteWebhook: z.boolean().nullish(),
    email: z.string().nullish(),
    id: z.string(),
    noSecret: z.boolean().nullish(),
    updateMetadata: z.boolean().nullish(),
    updateProjects: z.boolean().nullish(),
    webhookSecret: z.string().nullish()
  })
}

export function JoinOrganizationInputSchema(): z.ZodObject<Properties<JoinOrganizationInput>> {
  return z.object({
    inviteLink: z.string().nullish(),
    organizationId: z.string()
  })
}

export function LabelGroupSortSchema(): z.ZodObject<Properties<LabelGroupSort>> {
  return z.object({
    labelGroupId: z.string(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function LabelSortSchema(): z.ZodObject<Properties<LabelSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function LaunchDarklySettingsInputSchema(): z.ZodObject<Properties<LaunchDarklySettingsInput>> {
  return z.object({
    environment: z.string(),
    projectKey: z.string()
  })
}

export function LinkCountSortSchema(): z.ZodObject<Properties<LinkCountSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ManualSortSchema(): z.ZodObject<Properties<ManualSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function McpServerCustomHeaderInputSchema(): z.ZodObject<Properties<McpServerCustomHeaderInput>> {
  return z.object({
    name: z.string(),
    value: z.string()
  })
}

export function MicrosoftTeamsPostSettingsInputSchema(): z.ZodObject<Properties<MicrosoftTeamsPostSettingsInput>> {
  return z.object({
    channelId: z.string(),
    channelName: z.string(),
    membershipType: z.string(),
    teamId: z.string(),
    teamName: z.string(),
    tenantId: z.string()
  })
}

export function MicrosoftTeamsSettingsInputSchema(): z.ZodObject<Properties<MicrosoftTeamsSettingsInput>> {
  return z.object({
    enableCodeIntelligence: z.boolean().nullish(),
    tenantName: z.string().nullish()
  })
}

export function MilestoneSortSchema(): z.ZodObject<Properties<MilestoneSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function NameSortSchema(): z.ZodObject<Properties<NameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function NotificationCategoryPreferencesInputSchema(): z.ZodObject<Properties<NotificationCategoryPreferencesInput>> {
  return z.object({
    appsAndIntegrations: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    assignments: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    billing: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    commentsAndReplies: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    customers: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    documentChanges: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    feed: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    mentions: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    postsAndUpdates: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    reactions: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    reminders: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    reviews: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    statusChanges: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    subscriptions: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    triage: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish())
  })
}

export function NotificationDeliveryPreferencesChannelInputSchema(): z.ZodObject<Properties<NotificationDeliveryPreferencesChannelInput>> {
  return z.object({
    schedule: z.lazy(() => NotificationDeliveryPreferencesScheduleInputSchema().nullish())
  })
}

export function NotificationDeliveryPreferencesDayInputSchema(): z.ZodObject<Properties<NotificationDeliveryPreferencesDayInput>> {
  return z.object({
    end: z.string().nullish(),
    start: z.string().nullish()
  })
}

export function NotificationDeliveryPreferencesInputSchema(): z.ZodObject<Properties<NotificationDeliveryPreferencesInput>> {
  return z.object({
    mobile: z.lazy(() => NotificationDeliveryPreferencesChannelInputSchema().nullish())
  })
}

export function NotificationDeliveryPreferencesScheduleInputSchema(): z.ZodObject<Properties<NotificationDeliveryPreferencesScheduleInput>> {
  return z.object({
    disabled: z.boolean().nullish(),
    friday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    monday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    saturday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    sunday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    thursday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    tuesday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema()),
    wednesday: z.lazy(() => NotificationDeliveryPreferencesDayInputSchema())
  })
}

export function NotificationEntityInputSchema(): z.ZodObject<Properties<NotificationEntityInput>> {
  return z.object({
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    initiativeUpdateId: z.string().nullish(),
    issueId: z.string().nullish(),
    oauthClientApprovalId: z.string().nullish(),
    projectId: z.string().nullish(),
    projectUpdateId: z.string().nullish()
  })
}

export function NotificationFilterSchema(): z.ZodObject<Properties<NotificationFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NotificationFilterSchema())).nullish(),
    archivedAt: z.lazy(() => DateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => NotificationFilterSchema())).nullish(),
    subscriptionType: z.lazy(() => NotificationSubscriptionTypeComparatorSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NotificationSubscriptionCreateInputSchema(): z.ZodObject<Properties<NotificationSubscriptionCreateInput>> {
  return z.object({
    active: z.boolean().nullish(),
    contextViewType: ContextViewTypeSchema.nullish(),
    customViewId: z.string().nullish(),
    customerId: z.string().nullish(),
    cycleId: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    labelId: z.string().nullish(),
    notificationSubscriptionTypes: z.array(z.string()).nullish(),
    projectId: z.string().nullish(),
    teamId: z.string().nullish(),
    userContextViewType: UserContextViewTypeSchema.nullish(),
    userId: z.string().nullish()
  })
}

export function NotificationSubscriptionTypeComparatorSchema(): z.ZodObject<Properties<NotificationSubscriptionTypeComparator>> {
  return z.object({
    eq: NotificationSubscriptionTypeSchema.nullish(),
    in: z.array(NotificationSubscriptionTypeSchema).nullish(),
    neq: NotificationSubscriptionTypeSchema.nullish(),
    nin: z.array(NotificationSubscriptionTypeSchema).nullish()
  })
}

export function NotificationSubscriptionUpdateInputSchema(): z.ZodObject<Properties<NotificationSubscriptionUpdateInput>> {
  return z.object({
    active: z.boolean().nullish(),
    notificationSubscriptionTypes: z.array(z.string()).nullish()
  })
}

export function NotificationUpdateInputSchema(): z.ZodObject<Properties<NotificationUpdateInput>> {
  return z.object({
    initiativeUpdateId: z.string().nullish(),
    projectUpdateId: z.string().nullish(),
    readAt: z.string().nullish(),
    snoozedUntilAt: z.string().nullish()
  })
}

export function NotionSettingsInputSchema(): z.ZodObject<Properties<NotionSettingsInput>> {
  return z.object({
    workspaceId: z.string(),
    workspaceName: z.string()
  })
}

export function NullableCommentFilterSchema(): z.ZodObject<Properties<NullableCommentFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableCommentFilterSchema())).nullish(),
    body: z.lazy(() => StringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    documentContent: z.lazy(() => NullableDocumentContentFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => NullableInitiativeFilterSchema().nullish()),
    initiativeUpdate: z.lazy(() => NullableInitiativeUpdateFilterSchema().nullish()),
    issue: z.lazy(() => NullableIssueFilterSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableCommentFilterSchema())).nullish(),
    parent: z.lazy(() => NullableCommentFilterSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectUpdate: z.lazy(() => NullableProjectUpdateFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function NullableCustomerFilterSchema(): z.ZodObject<Properties<NullableCustomerFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableCustomerFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    domains: z.lazy(() => StringArrayComparatorSchema().nullish()),
    externalIds: z.lazy(() => StringArrayComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableCustomerFilterSchema())).nullish(),
    owner: z.lazy(() => NullableUserFilterSchema().nullish()),
    revenue: z.lazy(() => NumberComparatorSchema().nullish()),
    size: z.lazy(() => NumberComparatorSchema().nullish()),
    slackChannelId: z.lazy(() => StringComparatorSchema().nullish()),
    status: z.lazy(() => CustomerStatusFilterSchema().nullish()),
    tier: z.lazy(() => CustomerTierFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableCycleFilterSchema(): z.ZodObject<Properties<NullableCycleFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableCycleFilterSchema())).nullish(),
    completedAt: z.lazy(() => DateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    endsAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    inheritedFromId: z.lazy(() => IdComparatorSchema().nullish()),
    isActive: z.lazy(() => BooleanComparatorSchema().nullish()),
    isFuture: z.lazy(() => BooleanComparatorSchema().nullish()),
    isInCooldown: z.lazy(() => BooleanComparatorSchema().nullish()),
    isNext: z.lazy(() => BooleanComparatorSchema().nullish()),
    isPast: z.lazy(() => BooleanComparatorSchema().nullish()),
    isPrevious: z.lazy(() => BooleanComparatorSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    number: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => NullableCycleFilterSchema())).nullish(),
    startsAt: z.lazy(() => DateComparatorSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableDateComparatorSchema(): z.ZodObject<Properties<NullableDateComparator>> {
  return z.object({
    eq: z.string().nullish(),
    gt: z.string().nullish(),
    gte: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    lt: z.string().nullish(),
    lte: z.string().nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    null: z.boolean().nullish()
  })
}

export function NullableDocumentContentFilterSchema(): z.ZodObject<Properties<NullableDocumentContentFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableDocumentContentFilterSchema())).nullish(),
    content: z.lazy(() => NullableStringComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    document: z.lazy(() => DocumentFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => InitiativeFilterSchema().nullish()),
    issue: z.lazy(() => IssueFilterSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableDocumentContentFilterSchema())).nullish(),
    project: z.lazy(() => ProjectFilterSchema().nullish()),
    projectMilestone: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableDurationComparatorSchema(): z.ZodObject<Properties<NullableDurationComparator>> {
  return z.object({
    eq: z.string().nullish(),
    gt: z.string().nullish(),
    gte: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    lt: z.string().nullish(),
    lte: z.string().nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    null: z.boolean().nullish()
  })
}

export function NullableInitiativeFilterSchema(): z.ZodObject<Properties<NullableInitiativeFilter>> {
  return z.object({
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    ancestors: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => NullableInitiativeFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiativeUpdates: z.lazy(() => InitiativeUpdatesCollectionFilterSchema().nullish()),
    labels: z.lazy(() => InitiativeLabelCollectionFilterSchema().nullish()),
    leadTeam: z.lazy(() => NullableTeamFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableInitiativeFilterSchema())).nullish(),
    owner: z.lazy(() => NullableUserFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    status: z.lazy(() => StringComparatorSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    teams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableInitiativeUpdateFilterSchema(): z.ZodObject<Properties<NullableInitiativeUpdateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableInitiativeUpdateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiative: z.lazy(() => InitiativeFilterSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableInitiativeUpdateFilterSchema())).nullish(),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function NullableIssueFilterSchema(): z.ZodObject<Properties<NullableIssueFilter>> {
  return z.object({
    accumulatedStateUpdatedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    activity: z.lazy(() => ActivityCollectionFilterSchema().nullish()),
    addedToCycleAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    addedToCyclePeriod: z.lazy(() => CyclePeriodComparatorSchema().nullish()),
    ageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    and: z.array(z.lazy(() => NullableIssueFilterSchema())).nullish(),
    archivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    assignee: z.lazy(() => NullableUserFilterSchema().nullish()),
    attachments: z.lazy(() => AttachmentCollectionFilterSchema().nullish()),
    autoArchivedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    autoClosedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    children: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    comments: z.lazy(() => CommentCollectionFilterSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    cycle: z.lazy(() => NullableCycleFilterSchema().nullish()),
    cycleTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    delegate: z.lazy(() => NullableUserFilterSchema().nullish()),
    description: z.lazy(() => NullableStringComparatorSchema().nullish()),
    dueDate: z.lazy(() => NullableTimelessDateComparatorSchema().nullish()),
    estimate: z.lazy(() => EstimateComparatorSchema().nullish()),
    hasActiveAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDismissedAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDuplicateRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasErroredAgentSessions: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasMergedAgentPullRequests: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSharedUsers: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedAssignees: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedLabels: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedProjects: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedRelatedIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedSimilarIssues: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasSuggestedTeams: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    id: z.lazy(() => IssueIdComparatorSchema().nullish()),
    labels: z.lazy(() => IssueLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    leadTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    null: z.boolean().nullish(),
    number: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => NullableIssueFilterSchema())).nullish(),
    parent: z.lazy(() => NullableIssueFilterSchema().nullish()),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    projectMilestone: z.lazy(() => NullableProjectMilestoneFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    recurringIssueTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    releases: z.lazy(() => ReleaseCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    sharedWith: z.lazy(() => UserCollectionFilterSchema().nullish()),
    slaBreachesAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    slaStatus: z.lazy(() => SlaStatusComparatorSchema().nullish()),
    snoozedBy: z.lazy(() => NullableUserFilterSchema().nullish()),
    snoozedUntilAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    sourceMetadata: z.lazy(() => SourceMetadataComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => WorkflowStateFilterSchema().nullish()),
    subscribers: z.lazy(() => UserCollectionFilterSchema().nullish()),
    suggestions: z.lazy(() => IssueSuggestionCollectionFilterSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    triageTime: z.lazy(() => NullableDurationComparatorSchema().nullish()),
    triagedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableNumberComparatorSchema(): z.ZodObject<Properties<NullableNumberComparator>> {
  return z.object({
    eq: z.number().nullish(),
    gt: z.number().nullish(),
    gte: z.number().nullish(),
    in: z.array(z.number()).nullish(),
    lt: z.number().nullish(),
    lte: z.number().nullish(),
    neq: z.number().nullish(),
    nin: z.array(z.number()).nullish(),
    null: z.boolean().nullish()
  })
}

export function NullableProjectFilterSchema(): z.ZodObject<Properties<NullableProjectFilter>> {
  return z.object({
    accessibleTeams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    and: z.array(z.lazy(() => NullableProjectFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedProjectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependedOnByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependsOnRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasViolatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiatives: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    labels: z.lazy(() => ProjectLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    lead: z.lazy(() => NullableUserFilterSchema().nullish()),
    members: z.lazy(() => UserCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    nextProjectMilestone: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableProjectFilterSchema())).nullish(),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    projectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    projectUpdates: z.lazy(() => ProjectUpdatesCollectionFilterSchema().nullish()),
    roadmaps: z.lazy(() => RoadmapCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    startDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => StringComparatorSchema().nullish()),
    status: z.lazy(() => ProjectStatusFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableProjectMilestoneFilterSchema(): z.ZodObject<Properties<NullableProjectMilestoneFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableProjectMilestoneFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => NullableStringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableProjectMilestoneFilterSchema())).nullish(),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableProjectUpdateFilterSchema(): z.ZodObject<Properties<NullableProjectUpdateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableProjectUpdateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableProjectUpdateFilterSchema())).nullish(),
    project: z.lazy(() => ProjectFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function NullableStringComparatorSchema(): z.ZodObject<Properties<NullableStringComparator>> {
  return z.object({
    contains: z.string().nullish(),
    containsIgnoreCase: z.string().nullish(),
    containsIgnoreCaseAndAccent: z.string().nullish(),
    endsWith: z.string().nullish(),
    eq: z.string().nullish(),
    eqIgnoreCase: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    neqIgnoreCase: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    notContains: z.string().nullish(),
    notContainsIgnoreCase: z.string().nullish(),
    notEndsWith: z.string().nullish(),
    notStartsWith: z.string().nullish(),
    null: z.boolean().nullish(),
    startsWith: z.string().nullish(),
    startsWithIgnoreCase: z.string().nullish()
  })
}

export function NullableTeamFilterSchema(): z.ZodObject<Properties<NullableTeamFilter>> {
  return z.object({
    ancestors: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => NullableTeamFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => NullableStringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    key: z.lazy(() => StringComparatorSchema().nullish()),
    members: z.lazy(() => UserCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableTeamFilterSchema())).nullish(),
    owners: z.lazy(() => UserCollectionFilterSchema().nullish()),
    parent: z.lazy(() => NullableTeamFilterSchema().nullish()),
    private: z.lazy(() => BooleanComparatorSchema().nullish()),
    releasePipelines: z.lazy(() => ReleasePipelineCollectionFilterSchema().nullish()),
    restrictedBy: z.lazy(() => NullableTeamFilterSchema().nullish()),
    retiredAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    users: z.lazy(() => UserCollectionFilterSchema().nullish()),
    visibility: z.lazy(() => TeamVisibilityComparatorSchema().nullish())
  })
}

export function NullableTemplateFilterSchema(): z.ZodObject<Properties<NullableTemplateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => NullableTemplateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    inheritedFromId: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableTemplateFilterSchema())).nullish(),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NullableTimelessDateComparatorSchema(): z.ZodObject<Properties<NullableTimelessDateComparator>> {
  return z.object({
    eq: z.string().nullish(),
    gt: z.string().nullish(),
    gte: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    lt: z.string().nullish(),
    lte: z.string().nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    null: z.boolean().nullish()
  })
}

export function NullableUserFilterSchema(): z.ZodObject<Properties<NullableUserFilter>> {
  return z.object({
    active: z.lazy(() => BooleanComparatorSchema().nullish()),
    admin: z.lazy(() => BooleanComparatorSchema().nullish()),
    and: z.array(z.lazy(() => NullableUserFilterSchema())).nullish(),
    app: z.lazy(() => BooleanComparatorSchema().nullish()),
    assignedIssues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    displayName: z.lazy(() => StringComparatorSchema().nullish()),
    email: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    invited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isInvited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isMe: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => NullableUserFilterSchema())).nullish(),
    owner: z.lazy(() => BooleanComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function NumberComparatorSchema(): z.ZodObject<Properties<NumberComparator>> {
  return z.object({
    eq: z.number().nullish(),
    gt: z.number().nullish(),
    gte: z.number().nullish(),
    in: z.array(z.number()).nullish(),
    lt: z.number().nullish(),
    lte: z.number().nullish(),
    neq: z.number().nullish(),
    nin: z.array(z.number()).nullish()
  })
}

export function OAuthApplicationCreateInputSchema(): z.ZodObject<Properties<OAuthApplicationCreateInput>> {
  return z.object({
    description: z.string().nullish(),
    developer: z.string(),
    developerUrl: z.string().nullish(),
    grantTypes: z.array(OAuthApplicationGrantTypeSchema).nullish(),
    idempotencyKey: z.string().nullish(),
    imageUrl: z.string().nullish(),
    name: z.string(),
    redirectUris: z.array(z.string()),
    webhookResourceTypes: z.array(WebhookResourceTypeSchema).nullish(),
    webhookUrl: z.string().nullish()
  })
}

export function OAuthApplicationUpdateInputSchema(): z.ZodObject<Properties<OAuthApplicationUpdateInput>> {
  return z.object({
    description: z.string().nullish(),
    developer: z.string().nullish(),
    developerUrl: z.string().nullish(),
    grantTypes: z.array(OAuthApplicationGrantTypeSchema).nullish(),
    imageUrl: z.string().nullish(),
    name: z.string().nullish(),
    redirectUris: z.array(z.string()).nullish(),
    webhookEnabled: z.boolean().nullish(),
    webhookResourceTypes: z.array(WebhookResourceTypeSchema).nullish(),
    webhookUrl: z.string().nullish()
  })
}

export function OnboardingCustomerSurveySchema(): z.ZodObject<Properties<OnboardingCustomerSurvey>> {
  return z.object({
    companyRole: z.string().nullish(),
    companySize: z.string().nullish()
  })
}

export function OpsgenieInputSchema(): z.ZodObject<Properties<OpsgenieInput>> {
  return z.object({
    apiFailedWithUnauthorizedErrorAt: z.string().nullish()
  })
}

export function OrganizationAuthSettingsInputSchema(): z.ZodObject<Properties<OrganizationAuthSettingsInput>> {
  return z.object({
    allowedAuthServiceBypassRole: z.string().nullish(),
    allowedAuthServices: z.array(z.string()).nullish(),
    disableAuthServiceBypass: z.boolean().nullish(),
    hideNonPrimaryOrganizations: z.boolean().nullish()
  })
}

export function OrganizationCodingAgentSettingsInputSchema(): z.ZodObject<Properties<OrganizationCodingAgentSettingsInput>> {
  return z.object({
    commitSigningEnabled: z.boolean().nullish(),
    effort: z.string().nullish(),
    model: z.string().nullish()
  })
}

export function OrganizationDomainCreateInputSchema(): z.ZodObject<Properties<OrganizationDomainCreateInput>> {
  return z.object({
    authType: z.string().default("general").nullish(),
    id: z.string().nullish(),
    identityProviderId: z.string().nullish(),
    name: z.string(),
    verificationEmail: z.string().nullish()
  })
}

export function OrganizationDomainUpdateInputSchema(): z.ZodObject<Properties<OrganizationDomainUpdateInput>> {
  return z.object({
    disableOrganizationCreation: z.boolean().nullish()
  })
}

export function OrganizationDomainVerificationInputSchema(): z.ZodObject<Properties<OrganizationDomainVerificationInput>> {
  return z.object({
    organizationDomainId: z.string(),
    verificationCode: z.string()
  })
}

export function OrganizationInviteCreateInputSchema(): z.ZodObject<Properties<OrganizationInviteCreateInput>> {
  return z.object({
    email: z.string(),
    id: z.string().nullish(),
    metadata: z.unknown().nullish(),
    role: UserRoleTypeSchema.default(UserRoleType.User).nullish(),
    teamIds: z.array(z.string()).nullish()
  })
}

export function OrganizationInviteUpdateInputSchema(): z.ZodObject<Properties<OrganizationInviteUpdateInput>> {
  return z.object({
    teamIds: z.array(z.string())
  })
}

export function OrganizationIpRestrictionInputSchema(): z.ZodObject<Properties<OrganizationIpRestrictionInput>> {
  return z.object({
    description: z.string().nullish(),
    enabled: z.boolean(),
    range: z.string(),
    type: z.string()
  })
}

export function OrganizationLinearAgentMcpServerAllowlistEntryInputSchema(): z.ZodObject<Properties<OrganizationLinearAgentMcpServerAllowlistEntryInput>> {
  return z.object({
    knownIntegrationKey: z.string().nullish(),
    url: z.string()
  })
}

export function OrganizationLinearAgentSettingsInputSchema(): z.ZodObject<Properties<OrganizationLinearAgentSettingsInput>> {
  return z.object({
    mcpServersAllowlist: z.array(z.lazy(() => OrganizationLinearAgentMcpServerAllowlistEntryInputSchema())).nullish(),
    mcpServersEnabled: z.boolean().nullish(),
    mcpServersMode: LinearAgentMcpServersModeSchema.nullish(),
    trustedSourcesAllowlist: z.array(z.lazy(() => OrganizationLinearAgentTrustedSourcesAllowlistEntryInputSchema())).nullish(),
    trustedSourcesMode: LinearAgentTrustedSourcesModeSchema.nullish(),
    webSearchEnabled: z.boolean().nullish()
  })
}

export function OrganizationLinearAgentTrustedSourcesAllowlistEntryInputSchema(): z.ZodObject<Properties<OrganizationLinearAgentTrustedSourcesAllowlistEntryInput>> {
  return z.object({
    key: z.string()
  })
}

export function OrganizationSecuritySettingsInputSchema(): z.ZodObject<Properties<OrganizationSecuritySettingsInput>> {
  return z.object({
    agentGuidanceRole: UserRoleTypeSchema.nullish(),
    apiSettingsRole: UserRoleTypeSchema.nullish(),
    automationManagementRole: UserRoleTypeSchema.nullish(),
    importRole: UserRoleTypeSchema.nullish(),
    integrationCreationRole: UserRoleTypeSchema.nullish(),
    invitationsRole: UserRoleTypeSchema.nullish(),
    labelManagementRole: UserRoleTypeSchema.nullish(),
    personalApiKeysRole: UserRoleTypeSchema.nullish(),
    teamCreationRole: UserRoleTypeSchema.nullish(),
    templateManagementRole: UserRoleTypeSchema.nullish()
  })
}

export function OrganizationStartTrialInputSchema(): z.ZodObject<Properties<OrganizationStartTrialInput>> {
  return z.object({
    planType: z.string()
  })
}

export function OrganizationThemeSettingsInputSchema(): z.ZodObject<Properties<OrganizationThemeSettingsInput>> {
  return z.object({
    darkTheme: z.unknown().nullish(),
    lightTheme: z.unknown().nullish()
  })
}

export function OrganizationUpdateInputSchema(): z.ZodObject<Properties<OrganizationUpdateInput>> {
  return z.object({
    agentAutomationEnabled: z.boolean().nullish(),
    aiAddonEnabled: z.boolean().nullish(),
    aiDiscussionSummariesEnabled: z.boolean().nullish(),
    aiTelemetryEnabled: z.boolean().nullish(),
    aiThreadSummariesEnabled: z.boolean().nullish(),
    allowedFileUploadContentTypes: z.array(z.string()).nullish(),
    authSettings: z.lazy(() => OrganizationAuthSettingsInputSchema().nullish()),
    codeIntelligenceEnabled: z.boolean().nullish(),
    codeIntelligenceRepository: z.string().nullish(),
    codingAgentEnabled: z.boolean().nullish(),
    codingAgentSettings: z.lazy(() => OrganizationCodingAgentSettingsInputSchema().nullish()),
    customersConfiguration: z.lazy(() => CustomersConfigurationInputSchema().nullish()),
    customersEnabled: z.boolean().nullish(),
    defaultFeedSummarySchedule: FeedSummaryScheduleSchema.nullish(),
    defaultHomeView: z.string().nullish(),
    feedEnabled: z.boolean().nullish(),
    fiscalYearStartMonth: z.number().nullish(),
    generatedUpdatesEnabled: z.boolean().nullish(),
    gitBranchFormat: z.string().nullish(),
    gitLinkbackDescriptionsEnabled: z.boolean().nullish(),
    gitLinkbackMessagesEnabled: z.boolean().nullish(),
    gitPublicLinkbackMessagesEnabled: z.boolean().nullish(),
    hipaaComplianceEnabled: z.boolean().nullish(),
    initiativeUpdateReminderFrequencyInWeeks: z.number().nullish(),
    initiativeUpdateRemindersDay: DaySchema.nullish(),
    initiativeUpdateRemindersHour: z.number().nullish(),
    ipRestrictions: z.array(z.lazy(() => OrganizationIpRestrictionInputSchema())).nullish(),
    linearAgentEnabled: z.boolean().nullish(),
    linearAgentSettings: z.lazy(() => OrganizationLinearAgentSettingsInputSchema().nullish()),
    logoUrl: z.string().nullish(),
    name: z.string().nullish(),
    oauthAppReview: z.boolean().nullish(),
    projectUpdateReminderFrequencyInWeeks: z.number().nullish(),
    projectUpdateRemindersDay: DaySchema.nullish(),
    projectUpdateRemindersHour: z.number().nullish(),
    pullRequestIssueMode: z.string().nullish(),
    pullRequestTourEnabled: z.boolean().nullish(),
    reducedPersonalInformation: z.boolean().nullish(),
    restrictAgentInvocationToMembers: z.boolean().nullish(),
    roadmapEnabled: z.boolean().nullish(),
    securitySettings: z.lazy(() => OrganizationSecuritySettingsInputSchema().nullish()),
    slaEnabled: z.boolean().nullish(),
    slackAutoCreateProjectChannel: z.boolean().nullish(),
    slackProjectChannelIntegrationId: z.string().nullish(),
    slackProjectChannelPrefix: z.string().nullish(),
    slackProjectChannelsEnabled: z.boolean().nullish(),
    themeSettings: z.lazy(() => OrganizationThemeSettingsInputSchema().nullish()),
    urlKey: z.string().nullish(),
    workingDays: z.array(z.number()).nullish()
  })
}

export function OwnerSortSchema(): z.ZodObject<Properties<OwnerSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function PagerDutyInputSchema(): z.ZodObject<Properties<PagerDutyInput>> {
  return z.object({
    apiFailedWithUnauthorizedErrorAt: z.string().nullish()
  })
}

export function PartialNotificationChannelPreferencesInputSchema(): z.ZodObject<Properties<PartialNotificationChannelPreferencesInput>> {
  return z.object({
    desktop: z.boolean().nullish(),
    email: z.boolean().nullish(),
    mobile: z.boolean().nullish(),
    slack: z.boolean().nullish()
  })
}

export function PartnerApplicationCreateInputSchema(): z.ZodObject<Properties<PartnerApplicationCreateInput>> {
  return z.object({
    cohortsPerYear: z.string().nullish(),
    companiesPerCohort: z.string().nullish(),
    consent: z.boolean(),
    description: z.string(),
    distributionChannels: z.array(z.string()).nullish(),
    email: z.string(),
    fullName: z.string(),
    investmentStages: z.array(z.string()).nullish(),
    networkSize: z.string().nullish(),
    offersSoftwarePerks: z.string().nullish(),
    organizationName: z.string(),
    organizationType: z.string(),
    organizationWebsite: z.string(),
    otherPerks: z.string().nullish(),
    portfolioCompanies: z.string().nullish(),
    region: z.string(),
    role: z.string()
  })
}

export function PrioritySortSchema(): z.ZodObject<Properties<PrioritySort>> {
  return z.object({
    noPriorityFirst: z.boolean().default(false).nullish(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish(),
    usePrioritySortOrderTiebreaker: z.boolean().default(true).nullish()
  })
}

export function ProjectCollectionFilterSchema(): z.ZodObject<Properties<ProjectCollectionFilter>> {
  return z.object({
    accessibleTeams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    and: z.array(z.lazy(() => ProjectCollectionFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedProjectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    every: z.lazy(() => ProjectFilterSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependedOnByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependsOnRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasViolatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiatives: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    labels: z.lazy(() => ProjectLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    lead: z.lazy(() => NullableUserFilterSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    members: z.lazy(() => UserCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    nextProjectMilestone: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    or: z.array(z.lazy(() => ProjectCollectionFilterSchema())).nullish(),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    projectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    projectUpdates: z.lazy(() => ProjectUpdatesCollectionFilterSchema().nullish()),
    roadmaps: z.lazy(() => RoadmapCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    some: z.lazy(() => ProjectFilterSchema().nullish()),
    startDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => StringComparatorSchema().nullish()),
    status: z.lazy(() => ProjectStatusFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectCreateInputSchema(): z.ZodObject<Properties<ProjectCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    content: z.string().nullish(),
    convertedFromIssueId: z.string().nullish(),
    description: z.string().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    leadId: z.string().nullish(),
    memberIds: z.array(z.string()).nullish(),
    name: z.string(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    sortOrder: z.number().nullish(),
    startDate: z.string().nullish(),
    startDateResolution: DateResolutionTypeSchema.nullish(),
    statusId: z.string().nullish(),
    targetDate: z.string().nullish(),
    targetDateResolution: DateResolutionTypeSchema.nullish(),
    teamIds: z.array(z.string()),
    templateId: z.string().nullish(),
    useDefaultTemplate: z.boolean().nullish()
  })
}

export function ProjectCreatedAtSortSchema(): z.ZodObject<Properties<ProjectCreatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectFilterSchema(): z.ZodObject<Properties<ProjectFilter>> {
  return z.object({
    accessibleTeams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    activityType: z.lazy(() => StringComparatorSchema().nullish()),
    and: z.array(z.lazy(() => ProjectFilterSchema())).nullish(),
    canceledAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    completedProjectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    customerCount: z.lazy(() => NumberComparatorSchema().nullish()),
    customerImportantCount: z.lazy(() => NumberComparatorSchema().nullish()),
    hasBlockedByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasBlockingRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependedOnByRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasDependsOnRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasRelatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    hasViolatedRelations: z.lazy(() => RelationExistsComparatorSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    healthWithAge: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    initiatives: z.lazy(() => InitiativeCollectionFilterSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    labels: z.lazy(() => ProjectLabelCollectionFilterSchema().nullish()),
    lastAppliedTemplate: z.lazy(() => NullableTemplateFilterSchema().nullish()),
    lead: z.lazy(() => NullableUserFilterSchema().nullish()),
    members: z.lazy(() => UserCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    needs: z.lazy(() => CustomerNeedCollectionFilterSchema().nullish()),
    nextProjectMilestone: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    or: z.array(z.lazy(() => ProjectFilterSchema())).nullish(),
    priority: z.lazy(() => NullableNumberComparatorSchema().nullish()),
    projectMilestones: z.lazy(() => ProjectMilestoneCollectionFilterSchema().nullish()),
    projectUpdates: z.lazy(() => ProjectUpdatesCollectionFilterSchema().nullish()),
    roadmaps: z.lazy(() => RoadmapCollectionFilterSchema().nullish()),
    searchableContent: z.lazy(() => ContentComparatorSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    startDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    startedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    state: z.lazy(() => StringComparatorSchema().nullish()),
    status: z.lazy(() => ProjectStatusFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectHealthSortSchema(): z.ZodObject<Properties<ProjectHealthSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectLabelCollectionFilterSchema(): z.ZodObject<Properties<ProjectLabelCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectLabelCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    every: z.lazy(() => ProjectLabelFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    null: z.boolean().nullish(),
    or: z.array(z.lazy(() => ProjectLabelCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => ProjectLabelFilterSchema().nullish()),
    some: z.lazy(() => ProjectLabelCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectLabelCreateInputSchema(): z.ZodObject<Properties<ProjectLabelCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish(),
    teamId: z.string().nullish()
  })
}

export function ProjectLabelFilterSchema(): z.ZodObject<Properties<ProjectLabelFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectLabelFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => NullableUserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isGroup: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectLabelFilterSchema())).nullish(),
    parent: z.lazy(() => ProjectLabelFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectLabelUpdateInputSchema(): z.ZodObject<Properties<ProjectLabelUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    isGroup: z.boolean().nullish(),
    name: z.string().nullish(),
    parentId: z.string().nullish(),
    retiredAt: z.string().nullish()
  })
}

export function ProjectLeadSortSchema(): z.ZodObject<Properties<ProjectLeadSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectManualSortSchema(): z.ZodObject<Properties<ProjectManualSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectMilestoneCollectionFilterSchema(): z.ZodObject<Properties<ProjectMilestoneCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectMilestoneCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => NullableStringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectMilestoneCollectionFilterSchema())).nullish(),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    some: z.lazy(() => ProjectMilestoneFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectMilestoneCreateInputSchema(): z.ZodObject<Properties<ProjectMilestoneCreateInput>> {
  return z.object({
    description: z.string().nullish(),
    descriptionData: z.unknown().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    projectId: z.string(),
    sortOrder: z.number().nullish(),
    targetDate: z.string().nullish()
  })
}

export function ProjectMilestoneFilterSchema(): z.ZodObject<Properties<ProjectMilestoneFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectMilestoneFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => NullableStringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectMilestoneFilterSchema())).nullish(),
    project: z.lazy(() => NullableProjectFilterSchema().nullish()),
    targetDate: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectMilestoneMoveInputSchema(): z.ZodObject<Properties<ProjectMilestoneMoveInput>> {
  return z.object({
    addIssueTeamToProject: z.boolean().nullish(),
    newIssueTeamId: z.string().nullish(),
    projectId: z.string(),
    undoIssueTeamIds: z.array(z.lazy(() => ProjectMilestoneMoveIssueToTeamInputSchema())).nullish(),
    undoProjectTeamIds: z.lazy(() => ProjectMilestoneMoveProjectTeamsInputSchema().nullish())
  })
}

export function ProjectMilestoneMoveIssueToTeamInputSchema(): z.ZodObject<Properties<ProjectMilestoneMoveIssueToTeamInput>> {
  return z.object({
    issueId: z.string(),
    teamId: z.string()
  })
}

export function ProjectMilestoneMoveProjectTeamsInputSchema(): z.ZodObject<Properties<ProjectMilestoneMoveProjectTeamsInput>> {
  return z.object({
    projectId: z.string(),
    teamIds: z.array(z.string())
  })
}

export function ProjectMilestoneUpdateInputSchema(): z.ZodObject<Properties<ProjectMilestoneUpdateInput>> {
  return z.object({
    description: z.string().nullish(),
    descriptionData: z.unknown().nullish(),
    name: z.string().nullish(),
    projectId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    targetDate: z.string().nullish()
  })
}

export function ProjectNameSortSchema(): z.ZodObject<Properties<ProjectNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectPrioritySortSchema(): z.ZodObject<Properties<ProjectPrioritySort>> {
  return z.object({
    noPriorityFirst: z.boolean().default(false).nullish(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectRelationCreateInputSchema(): z.ZodObject<Properties<ProjectRelationCreateInput>> {
  return z.object({
    anchorType: z.string(),
    id: z.string().nullish(),
    projectId: z.string(),
    projectMilestoneId: z.string().nullish(),
    relatedAnchorType: z.string(),
    relatedProjectId: z.string(),
    relatedProjectMilestoneId: z.string().nullish(),
    type: z.string()
  })
}

export function ProjectRelationUpdateInputSchema(): z.ZodObject<Properties<ProjectRelationUpdateInput>> {
  return z.object({
    anchorType: z.string().nullish(),
    projectId: z.string().nullish(),
    projectMilestoneId: z.string().nullish(),
    relatedAnchorType: z.string().nullish(),
    relatedProjectId: z.string().nullish(),
    relatedProjectMilestoneId: z.string().nullish(),
    type: z.string().nullish()
  })
}

export function ProjectSortSchema(): z.ZodObject<Properties<ProjectSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectSortInputSchema(): z.ZodObject<Properties<ProjectSortInput>> {
  return z.object({
    createdAt: z.lazy(() => ProjectCreatedAtSortSchema().nullish()),
    health: z.lazy(() => ProjectHealthSortSchema().nullish()),
    lead: z.lazy(() => ProjectLeadSortSchema().nullish()),
    manual: z.lazy(() => ProjectManualSortSchema().nullish()),
    name: z.lazy(() => ProjectNameSortSchema().nullish()),
    priority: z.lazy(() => ProjectPrioritySortSchema().nullish()),
    startDate: z.lazy(() => StartDateSortSchema().nullish()),
    status: z.lazy(() => ProjectStatusSortSchema().nullish()),
    targetDate: z.lazy(() => TargetDateSortSchema().nullish()),
    updatedAt: z.lazy(() => ProjectUpdatedAtSortSchema().nullish())
  })
}

export function ProjectStatusCreateInputSchema(): z.ZodObject<Properties<ProjectStatusCreateInput>> {
  return z.object({
    color: z.string(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    indefinite: z.boolean().default(false).nullish(),
    name: z.string(),
    position: z.number(),
    type: ProjectStatusTypeSchema
  })
}

export function ProjectStatusFilterSchema(): z.ZodObject<Properties<ProjectStatusFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectStatusFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectStatusFilterSchema())).nullish(),
    position: z.lazy(() => NumberComparatorSchema().nullish()),
    projects: z.lazy(() => ProjectCollectionFilterSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectStatusSortSchema(): z.ZodObject<Properties<ProjectStatusSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectStatusUpdateInputSchema(): z.ZodObject<Properties<ProjectStatusUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    indefinite: z.boolean().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish(),
    type: ProjectStatusTypeSchema.nullish()
  })
}

export function ProjectUpdateCreateInputSchema(): z.ZodObject<Properties<ProjectUpdateCreateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    health: ProjectUpdateHealthTypeSchema.nullish(),
    id: z.string().nullish(),
    isDiffHidden: z.boolean().nullish(),
    projectId: z.string()
  })
}

export function ProjectUpdateFilterSchema(): z.ZodObject<Properties<ProjectUpdateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectUpdateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectUpdateFilterSchema())).nullish(),
    project: z.lazy(() => ProjectFilterSchema().nullish()),
    reactions: z.lazy(() => ReactionCollectionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    user: z.lazy(() => UserFilterSchema().nullish())
  })
}

export function ProjectUpdateInputSchema(): z.ZodObject<Properties<ProjectUpdateInput>> {
  return z.object({
    canceledAt: z.string().nullish(),
    color: z.string().nullish(),
    completedAt: z.string().nullish(),
    content: z.string().nullish(),
    convertedFromIssueId: z.string().nullish(),
    description: z.string().nullish(),
    frequencyResolution: FrequencyResolutionTypeSchema.nullish(),
    icon: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    lastAppliedTemplateId: z.string().nullish(),
    leadId: z.string().nullish(),
    memberIds: z.array(z.string()).nullish(),
    name: z.string().nullish(),
    priority: z.number().nullish(),
    prioritySortOrder: z.number().nullish(),
    projectUpdateRemindersPausedUntilAt: z.string().nullish(),
    slackIssueComments: z.boolean().nullish(),
    slackIssueStatuses: z.boolean().nullish(),
    slackNewIssue: z.boolean().nullish(),
    sortOrder: z.number().nullish(),
    startDate: z.string().nullish(),
    startDateResolution: DateResolutionTypeSchema.nullish(),
    statusId: z.string().nullish(),
    targetDate: z.string().nullish(),
    targetDateResolution: DateResolutionTypeSchema.nullish(),
    teamIds: z.array(z.string()).nullish(),
    trashed: z.boolean().nullish(),
    updateReminderFrequency: z.number().nullish(),
    updateReminderFrequencyInWeeks: z.number().nullish(),
    updateRemindersDay: DaySchema.nullish(),
    updateRemindersHour: z.number().nullish()
  })
}

export function ProjectUpdateUpdateInputSchema(): z.ZodObject<Properties<ProjectUpdateUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyData: z.unknown().nullish(),
    health: ProjectUpdateHealthTypeSchema.nullish()
  })
}

export function ProjectUpdatedAtSortSchema(): z.ZodObject<Properties<ProjectUpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ProjectUpdatesCollectionFilterSchema(): z.ZodObject<Properties<ProjectUpdatesCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectUpdatesCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => ProjectUpdatesFilterSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectUpdatesCollectionFilterSchema())).nullish(),
    some: z.lazy(() => ProjectUpdatesFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ProjectUpdatesFilterSchema(): z.ZodObject<Properties<ProjectUpdatesFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ProjectUpdatesFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    health: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ProjectUpdatesFilterSchema())).nullish(),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function PullRequestReferenceInputSchema(): z.ZodObject<Properties<PullRequestReferenceInput>> {
  return z.object({
    number: z.number(),
    repositoryName: z.string(),
    repositoryOwner: z.string()
  })
}

export function PushSubscriptionCreateInputSchema(): z.ZodObject<Properties<PushSubscriptionCreateInput>> {
  return z.object({
    data: z.string(),
    id: z.string().nullish(),
    type: PushSubscriptionTypeSchema.default(PushSubscriptionType.Web).nullish()
  })
}

export function ReactionCollectionFilterSchema(): z.ZodObject<Properties<ReactionCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReactionCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    customEmojiId: z.lazy(() => IdComparatorSchema().nullish()),
    emoji: z.lazy(() => StringComparatorSchema().nullish()),
    every: z.lazy(() => ReactionFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReactionCollectionFilterSchema())).nullish(),
    some: z.lazy(() => ReactionFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ReactionCreateInputSchema(): z.ZodObject<Properties<ReactionCreateInput>> {
  return z.object({
    commentId: z.string().nullish(),
    emoji: z.string(),
    id: z.string().nullish(),
    initiativeUpdateId: z.string().nullish(),
    issueId: z.string().nullish(),
    postId: z.string().nullish(),
    projectUpdateId: z.string().nullish(),
    pullRequestCommentId: z.string().nullish(),
    pullRequestId: z.string().nullish()
  })
}

export function ReactionFilterSchema(): z.ZodObject<Properties<ReactionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReactionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    customEmojiId: z.lazy(() => IdComparatorSchema().nullish()),
    emoji: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReactionFilterSchema())).nullish(),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function RelationExistsComparatorSchema(): z.ZodObject<Properties<RelationExistsComparator>> {
  return z.object({
    eq: z.boolean().nullish(),
    neq: z.boolean().nullish()
  })
}

export function ReleaseCollectionFilterSchema(): z.ZodObject<Properties<ReleaseCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleaseCollectionFilterSchema())).nullish(),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => ReleaseFilterSchema().nullish()),
    hasReleaseNotes: z.lazy(() => BooleanComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleaseCollectionFilterSchema())).nullish(),
    pipeline: z.lazy(() => ReleasePipelineFilterSchema().nullish()),
    some: z.lazy(() => ReleaseFilterSchema().nullish()),
    stage: z.lazy(() => ReleaseStageFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    version: z.lazy(() => StringComparatorSchema().nullish())
  })
}

export function ReleaseCompleteInputSchema(): z.ZodObject<Properties<ReleaseCompleteInput>> {
  return z.object({
    commitSha: z.string().nullish(),
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    pipelineId: z.string(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    version: z.string().nullish()
  })
}

export function ReleaseCompleteInputBaseSchema(): z.ZodObject<Properties<ReleaseCompleteInputBase>> {
  return z.object({
    commitSha: z.string().nullish(),
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    version: z.string().nullish()
  })
}

export function ReleaseCreateInputSchema(): z.ZodObject<Properties<ReleaseCreateInput>> {
  return z.object({
    commitSha: z.string().nullish(),
    completedAt: z.string().nullish(),
    createdAt: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    pipelineId: z.string(),
    stageId: z.string().nullish(),
    startDate: z.string().nullish(),
    startedAt: z.string().nullish(),
    targetDate: z.string().nullish(),
    version: z.string().nullish()
  })
}

export function ReleaseDebugSinkInputSchema(): z.ZodObject<Properties<ReleaseDebugSinkInput>> {
  return z.object({
    includePaths: z.array(z.string()).nullish(),
    includeSubjects: z.array(z.string()).nullish(),
    inspectedShas: z.array(z.string()),
    issues: z.unknown(),
    pullRequests: z.array(z.unknown()),
    revertedIssues: z.unknown().nullish()
  })
}

export function ReleaseDocumentInputSchema(): z.ZodObject<Properties<ReleaseDocumentInput>> {
  return z.object({
    content: z.string(),
    title: z.string()
  })
}

export function ReleaseFilterSchema(): z.ZodObject<Properties<ReleaseFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleaseFilterSchema())).nullish(),
    completedAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    hasReleaseNotes: z.lazy(() => BooleanComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleaseFilterSchema())).nullish(),
    pipeline: z.lazy(() => ReleasePipelineFilterSchema().nullish()),
    stage: z.lazy(() => ReleaseStageFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    version: z.lazy(() => StringComparatorSchema().nullish())
  })
}

export function ReleaseLinkInputSchema(): z.ZodObject<Properties<ReleaseLinkInput>> {
  return z.object({
    label: z.string().nullish(),
    url: z.string()
  })
}

export function ReleaseNoteCreateInputSchema(): z.ZodObject<Properties<ReleaseNoteCreateInput>> {
  return z.object({
    content: z.string().nullish(),
    id: z.string().nullish(),
    pipelineId: z.string(),
    rangeFromReleaseId: z.string().nullish(),
    rangeToReleaseId: z.string().nullish(),
    releaseIds: z.array(z.string()).nullish(),
    title: z.string().nullish()
  })
}

export function ReleaseNoteFilterSchema(): z.ZodObject<Properties<ReleaseNoteFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleaseNoteFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleaseNoteFilterSchema())).nullish(),
    pipeline: z.lazy(() => ReleasePipelineFilterSchema().nullish()),
    release: z.lazy(() => ReleaseFilterSchema().nullish()),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    title: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ReleaseNoteInputSchema(): z.ZodObject<Properties<ReleaseNoteInput>> {
  return z.object({
    content: z.string(),
    title: z.string().nullish()
  })
}

export function ReleaseNoteUpdateInputSchema(): z.ZodObject<Properties<ReleaseNoteUpdateInput>> {
  return z.object({
    content: z.string().nullish(),
    rangeFromReleaseId: z.string().nullish(),
    rangeToReleaseId: z.string().nullish(),
    releaseIds: z.array(z.string()).nullish(),
    title: z.string().nullish()
  })
}

export function ReleasePipelineCollectionFilterSchema(): z.ZodObject<Properties<ReleasePipelineCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleasePipelineCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => ReleasePipelineFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isProduction: z.lazy(() => BooleanComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleasePipelineCollectionFilterSchema())).nullish(),
    some: z.lazy(() => ReleasePipelineFilterSchema().nullish()),
    teams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    type: z.lazy(() => ReleasePipelineTypeComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ReleasePipelineCreateInputSchema(): z.ZodObject<Properties<ReleasePipelineCreateInput>> {
  return z.object({
    autoGenerateReleaseNotesOnCompletion: z.boolean().nullish(),
    id: z.string().nullish(),
    includePathPatterns: z.array(z.string()).nullish(),
    isProduction: z.boolean().nullish(),
    name: z.string(),
    slugId: z.string().nullish(),
    teamIds: z.array(z.string()).nullish(),
    type: ReleasePipelineTypeSchema.nullish()
  })
}

export function ReleasePipelineFilterSchema(): z.ZodObject<Properties<ReleasePipelineFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleasePipelineFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    isProduction: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleasePipelineFilterSchema())).nullish(),
    teams: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    type: z.lazy(() => ReleasePipelineTypeComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ReleasePipelineNameSortSchema(): z.ZodObject<Properties<ReleasePipelineNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ReleasePipelineSortInputSchema(): z.ZodObject<Properties<ReleasePipelineSortInput>> {
  return z.object({
    name: z.lazy(() => ReleasePipelineNameSortSchema().nullish())
  })
}

export function ReleasePipelineTypeComparatorSchema(): z.ZodObject<Properties<ReleasePipelineTypeComparator>> {
  return z.object({
    eq: ReleasePipelineTypeSchema.nullish(),
    in: z.array(ReleasePipelineTypeSchema).nullish(),
    neq: ReleasePipelineTypeSchema.nullish(),
    nin: z.array(ReleasePipelineTypeSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function ReleasePipelineUpdateInputSchema(): z.ZodObject<Properties<ReleasePipelineUpdateInput>> {
  return z.object({
    autoGenerateReleaseNotesOnCompletion: z.boolean().nullish(),
    includePathPatterns: z.array(z.string()).nullish(),
    isProduction: z.boolean().nullish(),
    name: z.string().nullish(),
    slugId: z.string().nullish(),
    teamIds: z.array(z.string()).nullish(),
    type: ReleasePipelineTypeSchema.nullish()
  })
}

export function ReleaseSortSchema(): z.ZodObject<Properties<ReleaseSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ReleaseSortInputSchema(): z.ZodObject<Properties<ReleaseSortInput>> {
  return z.object({
    stage: z.lazy(() => ReleaseStageSortSchema().nullish())
  })
}

export function ReleaseStageCreateInputSchema(): z.ZodObject<Properties<ReleaseStageCreateInput>> {
  return z.object({
    color: z.string(),
    frozen: z.boolean().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    pipelineId: z.string(),
    position: z.number(),
    type: ReleaseStageTypeSchema
  })
}

export function ReleaseStageFilterSchema(): z.ZodObject<Properties<ReleaseStageFilter>> {
  return z.object({
    and: z.array(z.lazy(() => ReleaseStageFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => ReleaseStageFilterSchema())).nullish(),
    type: z.lazy(() => ReleaseStageTypeComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function ReleaseStageSortSchema(): z.ZodObject<Properties<ReleaseStageSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function ReleaseStageTypeComparatorSchema(): z.ZodObject<Properties<ReleaseStageTypeComparator>> {
  return z.object({
    eq: ReleaseStageTypeSchema.nullish(),
    in: z.array(ReleaseStageTypeSchema).nullish(),
    neq: ReleaseStageTypeSchema.nullish(),
    nin: z.array(ReleaseStageTypeSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function ReleaseStageUpdateInputSchema(): z.ZodObject<Properties<ReleaseStageUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    frozen: z.boolean().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function ReleaseSyncInputSchema(): z.ZodObject<Properties<ReleaseSyncInput>> {
  return z.object({
    commitSha: z.string(),
    debugSink: z.lazy(() => ReleaseDebugSinkInputSchema().nullish()),
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    issueReferences: z.array(z.lazy(() => IssueReferenceInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    pipelineId: z.string(),
    pullRequestReferences: z.array(z.lazy(() => PullRequestReferenceInputSchema())).nullish(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    repository: z.lazy(() => RepositoryDataInputSchema().nullish()),
    revertedIssueReferences: z.array(z.lazy(() => IssueReferenceInputSchema())).nullish(),
    version: z.string().nullish()
  })
}

export function ReleaseSyncInputBaseSchema(): z.ZodObject<Properties<ReleaseSyncInputBase>> {
  return z.object({
    commitSha: z.string(),
    debugSink: z.lazy(() => ReleaseDebugSinkInputSchema().nullish()),
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    issueReferences: z.array(z.lazy(() => IssueReferenceInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    pullRequestReferences: z.array(z.lazy(() => PullRequestReferenceInputSchema())).nullish(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    repository: z.lazy(() => RepositoryDataInputSchema().nullish()),
    revertedIssueReferences: z.array(z.lazy(() => IssueReferenceInputSchema())).nullish(),
    version: z.string().nullish()
  })
}

export function ReleaseUpdateByPipelineInputSchema(): z.ZodObject<Properties<ReleaseUpdateByPipelineInput>> {
  return z.object({
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    pipelineId: z.string(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    stage: z.string().nullish(),
    version: z.string().nullish()
  })
}

export function ReleaseUpdateByPipelineInputBaseSchema(): z.ZodObject<Properties<ReleaseUpdateByPipelineInputBase>> {
  return z.object({
    documents: z.array(z.lazy(() => ReleaseDocumentInputSchema())).nullish(),
    links: z.array(z.lazy(() => ReleaseLinkInputSchema())).nullish(),
    name: z.string().nullish(),
    releaseNotes: z.lazy(() => ReleaseNoteInputSchema().nullish()),
    stage: z.string().nullish(),
    version: z.string().nullish()
  })
}

export function ReleaseUpdateInputSchema(): z.ZodObject<Properties<ReleaseUpdateInput>> {
  return z.object({
    commitSha: z.string().nullish(),
    completedAt: z.string().nullish(),
    description: z.string().nullish(),
    name: z.string().nullish(),
    stageId: z.string().nullish(),
    startDate: z.string().nullish(),
    startedAt: z.string().nullish(),
    targetDate: z.string().nullish(),
    trashed: z.boolean().nullish(),
    version: z.string().nullish()
  })
}

export function RepositoryDataInputSchema(): z.ZodObject<Properties<RepositoryDataInput>> {
  return z.object({
    name: z.string(),
    owner: z.string(),
    provider: z.string(),
    url: z.string()
  })
}

export function RevenueSortSchema(): z.ZodObject<Properties<RevenueSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function RoadmapCollectionFilterSchema(): z.ZodObject<Properties<RoadmapCollectionFilter>> {
  return z.object({
    and: z.array(z.lazy(() => RoadmapCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    every: z.lazy(() => RoadmapFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => RoadmapCollectionFilterSchema())).nullish(),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    some: z.lazy(() => RoadmapFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function RoadmapCreateInputSchema(): z.ZodObject<Properties<RoadmapCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    ownerId: z.string().nullish(),
    sortOrder: z.number().nullish()
  })
}

export function RoadmapFilterSchema(): z.ZodObject<Properties<RoadmapFilter>> {
  return z.object({
    and: z.array(z.lazy(() => RoadmapFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    creator: z.lazy(() => UserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => RoadmapFilterSchema())).nullish(),
    slugId: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function RoadmapToProjectCreateInputSchema(): z.ZodObject<Properties<RoadmapToProjectCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    projectId: z.string(),
    roadmapId: z.string(),
    sortOrder: z.number().nullish()
  })
}

export function RoadmapToProjectUpdateInputSchema(): z.ZodObject<Properties<RoadmapToProjectUpdateInput>> {
  return z.object({
    sortOrder: z.number().nullish()
  })
}

export function RoadmapUpdateInputSchema(): z.ZodObject<Properties<RoadmapUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    name: z.string().nullish(),
    ownerId: z.string().nullish(),
    sortOrder: z.number().nullish()
  })
}

export function RootIssueSortSchema(): z.ZodObject<Properties<RootIssueSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish(),
    sort: z.lazy(() => IssueSortInputSchema())
  })
}

export function SalesforceMetadataIntegrationComparatorSchema(): z.ZodObject<Properties<SalesforceMetadataIntegrationComparator>> {
  return z.object({
    caseMetadata: z.unknown().nullish()
  })
}

export function SalesforceSettingsInputSchema(): z.ZodObject<Properties<SalesforceSettingsInput>> {
  return z.object({
    automateTicketReopeningOnCancellation: z.boolean().nullish(),
    automateTicketReopeningOnComment: z.boolean().nullish(),
    automateTicketReopeningOnCompletion: z.boolean().nullish(),
    automateTicketReopeningOnProjectCancellation: z.boolean().nullish(),
    automateTicketReopeningOnProjectCompletion: z.boolean().nullish(),
    defaultTeam: z.string().nullish(),
    disableCustomerRequestsAutoCreation: z.boolean().nullish(),
    enableAiIntake: z.boolean().nullish(),
    reopenCaseStatus: z.string().nullish(),
    restrictVisibility: z.boolean().nullish(),
    sendNoteOnComment: z.boolean().nullish(),
    sendNoteOnStatusChange: z.boolean().nullish(),
    subdomain: z.string().nullish(),
    url: z.string().nullish()
  })
}

export function SemanticSearchFiltersSchema(): z.ZodObject<Properties<SemanticSearchFilters>> {
  return z.object({
    documents: z.lazy(() => DocumentFilterSchema().nullish()),
    initiatives: z.lazy(() => InitiativeFilterSchema().nullish()),
    issues: z.lazy(() => IssueFilterSchema().nullish()),
    projects: z.lazy(() => ProjectFilterSchema().nullish())
  })
}

export function SentrySettingsInputSchema(): z.ZodObject<Properties<SentrySettingsInput>> {
  return z.object({
    organizationId: z.string(),
    organizationSlug: z.string(),
    resolvingCompletesIssues: z.boolean(),
    unresolvingReopensIssues: z.boolean()
  })
}

export function SizeSortSchema(): z.ZodObject<Properties<SizeSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function SlaStatusComparatorSchema(): z.ZodObject<Properties<SlaStatusComparator>> {
  return z.object({
    eq: SlaStatusSchema.nullish(),
    in: z.array(SlaStatusSchema).nullish(),
    neq: SlaStatusSchema.nullish(),
    nin: z.array(SlaStatusSchema).nullish(),
    null: z.boolean().nullish()
  })
}

export function SlaStatusSortSchema(): z.ZodObject<Properties<SlaStatusSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function SlackAsksSettingsInputSchema(): z.ZodObject<Properties<SlackAsksSettingsInput>> {
  return z.object({
    canAdministrate: UserRoleTypeSchema,
    customerVisibility: CustomerVisibilityModeSchema.nullish(),
    enableAgent: z.boolean().nullish(),
    enableLinearAgentWorkflowAccess: z.boolean().nullish(),
    enterpriseId: z.string().nullish(),
    enterpriseName: z.string().nullish(),
    externalUserActions: z.boolean().nullish(),
    shouldUnfurl: z.boolean().nullish(),
    shouldUseDefaultUnfurl: z.boolean().nullish(),
    slackChannelMapping: z.array(z.lazy(() => SlackChannelNameMappingInputSchema())).nullish(),
    teamId: z.string().nullish(),
    teamName: z.string().nullish()
  })
}

export function SlackAsksTeamSettingsInputSchema(): z.ZodObject<Properties<SlackAsksTeamSettingsInput>> {
  return z.object({
    hasDefaultAsk: z.boolean(),
    id: z.string()
  })
}

export function SlackChannelNameMappingInputSchema(): z.ZodObject<Properties<SlackChannelNameMappingInput>> {
  return z.object({
    aiTitles: z.boolean().nullish(),
    autoCreateOnBotMention: z.boolean().nullish(),
    autoCreateOnEmoji: z.boolean().nullish(),
    autoCreateOnMessage: z.boolean().nullish(),
    autoCreateTemplateId: z.string().nullish(),
    botAdded: z.boolean().nullish(),
    id: z.string(),
    isPrivate: z.boolean().nullish(),
    isShared: z.boolean().nullish(),
    name: z.string(),
    postAcceptedFromTriageUpdates: z.boolean().nullish(),
    postCancellationUpdates: z.boolean().nullish(),
    postCompletionUpdates: z.boolean().nullish(),
    teams: z.array(z.lazy(() => SlackAsksTeamSettingsInputSchema()))
  })
}

export function SlackPostSettingsInputSchema(): z.ZodObject<Properties<SlackPostSettingsInput>> {
  return z.object({
    channel: z.string(),
    channelId: z.string(),
    channelType: SlackChannelTypeSchema.nullish(),
    configurationUrl: z.string(),
    teamId: z.string().nullish()
  })
}

export function SlackSettingsInputSchema(): z.ZodObject<Properties<SlackSettingsInput>> {
  return z.object({
    allowAgentInPrivateChannels: z.boolean().nullish(),
    enableAgent: z.boolean().nullish(),
    enableCodeIntelligence: z.boolean().nullish(),
    enableLinearAgentWorkflowAccess: z.boolean().nullish(),
    enterpriseId: z.string().nullish(),
    enterpriseName: z.string().nullish(),
    externalUserActions: z.boolean().nullish(),
    linkOnIssueIdMention: z.boolean(),
    shouldUnfurl: z.boolean().nullish(),
    shouldUseDefaultUnfurl: z.boolean().nullish(),
    syncAgentThreadsInPrivateChannels: z.boolean().nullish(),
    teamId: z.string().nullish(),
    teamName: z.string().nullish()
  })
}

export function SourceMetadataComparatorSchema(): z.ZodObject<Properties<SourceMetadataComparator>> {
  return z.object({
    null: z.boolean().nullish(),
    salesforceMetadata: z.lazy(() => SalesforceMetadataIntegrationComparatorSchema().nullish()),
    subType: z.lazy(() => SubTypeComparatorSchema().nullish())
  })
}

export function SourceTypeComparatorSchema(): z.ZodObject<Properties<SourceTypeComparator>> {
  return z.object({
    contains: z.string().nullish(),
    containsIgnoreCase: z.string().nullish(),
    containsIgnoreCaseAndAccent: z.string().nullish(),
    endsWith: z.string().nullish(),
    eq: z.string().nullish(),
    eqIgnoreCase: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    neqIgnoreCase: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    notContains: z.string().nullish(),
    notContainsIgnoreCase: z.string().nullish(),
    notEndsWith: z.string().nullish(),
    notStartsWith: z.string().nullish(),
    startsWith: z.string().nullish(),
    startsWithIgnoreCase: z.string().nullish()
  })
}

export function StartDateSortSchema(): z.ZodObject<Properties<StartDateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function StringArrayComparatorSchema(): z.ZodObject<Properties<StringArrayComparator>> {
  return z.object({
    every: z.lazy(() => StringItemComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    some: z.lazy(() => StringItemComparatorSchema().nullish())
  })
}

export function StringComparatorSchema(): z.ZodObject<Properties<StringComparator>> {
  return z.object({
    contains: z.string().nullish(),
    containsIgnoreCase: z.string().nullish(),
    containsIgnoreCaseAndAccent: z.string().nullish(),
    endsWith: z.string().nullish(),
    eq: z.string().nullish(),
    eqIgnoreCase: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    neqIgnoreCase: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    notContains: z.string().nullish(),
    notContainsIgnoreCase: z.string().nullish(),
    notEndsWith: z.string().nullish(),
    notStartsWith: z.string().nullish(),
    startsWith: z.string().nullish(),
    startsWithIgnoreCase: z.string().nullish()
  })
}

export function StringItemComparatorSchema(): z.ZodObject<Properties<StringItemComparator>> {
  return z.object({
    contains: z.string().nullish(),
    containsIgnoreCase: z.string().nullish(),
    containsIgnoreCaseAndAccent: z.string().nullish(),
    endsWith: z.string().nullish(),
    eq: z.string().nullish(),
    eqIgnoreCase: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    neqIgnoreCase: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    notContains: z.string().nullish(),
    notContainsIgnoreCase: z.string().nullish(),
    notEndsWith: z.string().nullish(),
    notStartsWith: z.string().nullish(),
    startsWith: z.string().nullish(),
    startsWithIgnoreCase: z.string().nullish()
  })
}

export function SubTypeComparatorSchema(): z.ZodObject<Properties<SubTypeComparator>> {
  return z.object({
    eq: z.string().nullish(),
    in: z.array(z.string()).nullish(),
    neq: z.string().nullish(),
    nin: z.array(z.string()).nullish(),
    null: z.boolean().nullish()
  })
}

export function TargetDateSortSchema(): z.ZodObject<Properties<TargetDateSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function TeamCollectionFilterSchema(): z.ZodObject<Properties<TeamCollectionFilter>> {
  return z.object({
    ancestors: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => TeamCollectionFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    every: z.lazy(() => TeamFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    or: z.array(z.lazy(() => TeamCollectionFilterSchema())).nullish(),
    parent: z.lazy(() => NullableTeamFilterSchema().nullish()),
    some: z.lazy(() => TeamFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function TeamCreateInputSchema(): z.ZodObject<Properties<TeamCreateInput>> {
  return z.object({
    autoArchivePeriod: z.number().nullish(),
    autoClosePeriod: z.number().nullish(),
    autoCloseStateId: z.string().nullish(),
    color: z.string().nullish(),
    cycleCooldownTime: z.number().nullish(),
    cycleDuration: z.number().nullish(),
    cycleIssueAutoAssignCompleted: z.boolean().nullish(),
    cycleIssueAutoAssignStarted: z.boolean().nullish(),
    cycleLockToActive: z.boolean().nullish(),
    cycleStartDay: z.number().nullish(),
    cyclesEnabled: z.boolean().nullish(),
    defaultIssueEstimate: z.number().nullish(),
    defaultProjectTemplateId: z.string().nullish(),
    defaultTemplateForMembersId: z.string().nullish(),
    defaultTemplateForNonMembersId: z.string().nullish(),
    description: z.string().nullish(),
    groupIssueHistory: z.boolean().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    inheritIssueEstimation: z.boolean().nullish(),
    inheritProductIntelligenceScope: z.boolean().nullish(),
    inheritSlackAutoCreateProjectChannel: z.boolean().nullish(),
    inheritWorkflowStatuses: z.boolean().nullish(),
    initiativesEnabled: z.boolean().nullish(),
    issueEstimationAllowZero: z.boolean().nullish(),
    issueEstimationExtended: z.boolean().nullish(),
    issueEstimationType: z.string().nullish(),
    issueSharingEnabled: z.boolean().nullish(),
    key: z.string().nullish(),
    name: z.string(),
    parentId: z.string().nullish(),
    private: z.boolean().nullish(),
    productIntelligenceScope: ProductIntelligenceScopeSchema.nullish(),
    requirePriorityToLeaveTriage: z.boolean().nullish(),
    setIssueSortOrderOnStateChange: z.string().nullish(),
    slackAutoCreateProjectChannel: z.boolean().nullish(),
    timezone: z.string().nullish(),
    triageEnabled: z.boolean().nullish(),
    upcomingCycleCount: z.number().nullish()
  })
}

export function TeamFilterSchema(): z.ZodObject<Properties<TeamFilter>> {
  return z.object({
    ancestors: z.lazy(() => TeamCollectionFilterSchema().nullish()),
    and: z.array(z.lazy(() => TeamFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => NullableStringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    key: z.lazy(() => StringComparatorSchema().nullish()),
    members: z.lazy(() => UserCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => TeamFilterSchema())).nullish(),
    owners: z.lazy(() => UserCollectionFilterSchema().nullish()),
    parent: z.lazy(() => NullableTeamFilterSchema().nullish()),
    private: z.lazy(() => BooleanComparatorSchema().nullish()),
    releasePipelines: z.lazy(() => ReleasePipelineCollectionFilterSchema().nullish()),
    restrictedBy: z.lazy(() => NullableTeamFilterSchema().nullish()),
    retiredAt: z.lazy(() => NullableDateComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish()),
    users: z.lazy(() => UserCollectionFilterSchema().nullish()),
    visibility: z.lazy(() => TeamVisibilityComparatorSchema().nullish())
  })
}

export function TeamMembershipCreateInputSchema(): z.ZodObject<Properties<TeamMembershipCreateInput>> {
  return z.object({
    id: z.string().nullish(),
    owner: z.boolean().nullish(),
    sortOrder: z.number().nullish(),
    teamId: z.string(),
    userId: z.string()
  })
}

export function TeamMembershipUpdateInputSchema(): z.ZodObject<Properties<TeamMembershipUpdateInput>> {
  return z.object({
    owner: z.boolean().nullish(),
    sortOrder: z.number().nullish()
  })
}

export function TeamSecuritySettingsInputSchema(): z.ZodObject<Properties<TeamSecuritySettingsInput>> {
  return z.object({
    agentSkillsManagement: TeamRoleTypeSchema.nullish(),
    automationManagement: TeamRoleTypeSchema.nullish(),
    issueSharing: TeamRoleTypeSchema.nullish(),
    labelManagement: TeamRoleTypeSchema.nullish(),
    memberManagement: TeamRoleTypeSchema.nullish(),
    teamManagement: TeamRoleTypeSchema.nullish(),
    templateManagement: TeamRoleTypeSchema.nullish()
  })
}

export function TeamSortSchema(): z.ZodObject<Properties<TeamSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function TeamUpdateInputSchema(): z.ZodObject<Properties<TeamUpdateInput>> {
  return z.object({
    aiDiscussionSummariesEnabled: z.boolean().nullish(),
    aiThreadSummariesEnabled: z.boolean().nullish(),
    allMembersCanJoin: z.boolean().nullish(),
    autoArchivePeriod: z.number().nullish(),
    autoCloseChildIssues: z.boolean().nullish(),
    autoCloseParentIssues: z.boolean().nullish(),
    autoClosePeriod: z.number().nullish(),
    autoCloseStateId: z.string().nullish(),
    color: z.string().nullish(),
    cycleCooldownTime: z.number().nullish(),
    cycleDuration: z.number().nullish(),
    cycleEnabledStartDate: z.string().nullish(),
    cycleIssueAutoAssignCompleted: z.boolean().nullish(),
    cycleIssueAutoAssignStarted: z.boolean().nullish(),
    cycleLockToActive: z.boolean().nullish(),
    cycleStartDay: z.number().nullish(),
    cyclesEnabled: z.boolean().nullish(),
    defaultIssueEstimate: z.number().nullish(),
    defaultIssueStateId: z.string().nullish(),
    defaultProjectTemplateId: z.string().nullish(),
    defaultTemplateForMembersId: z.string().nullish(),
    defaultTemplateForNonMembersId: z.string().nullish(),
    description: z.string().nullish(),
    groupIssueHistory: z.boolean().nullish(),
    handleSubTeamsOnRetirement: TeamRetirementSubTeamHandlingSchema.nullish(),
    icon: z.string().nullish(),
    inheritIssueEstimation: z.boolean().nullish(),
    inheritProductIntelligenceScope: z.boolean().nullish(),
    inheritSlackAutoCreateProjectChannel: z.boolean().nullish(),
    inheritWorkflowStatuses: z.boolean().nullish(),
    initiativesEnabled: z.boolean().nullish(),
    issueEstimationAllowZero: z.boolean().nullish(),
    issueEstimationExtended: z.boolean().nullish(),
    issueEstimationType: z.string().nullish(),
    issueSharingEnabled: z.boolean().nullish(),
    joinByDefault: z.boolean().nullish(),
    key: z.string().nullish(),
    name: z.string().nullish(),
    parentId: z.string().nullish(),
    private: z.boolean().nullish(),
    productIntelligenceScope: ProductIntelligenceScopeSchema.nullish(),
    requirePriorityToLeaveTriage: z.boolean().nullish(),
    retiredAt: z.string().nullish(),
    scimGroupName: z.string().nullish(),
    scimManaged: z.boolean().nullish(),
    securitySettings: z.lazy(() => TeamSecuritySettingsInputSchema().nullish()),
    setIssueSortOrderOnStateChange: z.string().nullish(),
    slackAutoCreateProjectChannel: z.boolean().nullish(),
    slackIssueComments: z.boolean().nullish(),
    slackIssueStatuses: z.boolean().nullish(),
    slackNewIssue: z.boolean().nullish(),
    timezone: z.string().nullish(),
    triageEnabled: z.boolean().nullish(),
    upcomingCycleCount: z.number().nullish()
  })
}

export function TeamVisibilityComparatorSchema(): z.ZodObject<Properties<TeamVisibilityComparator>> {
  return z.object({
    eq: TeamVisibilitySchema.nullish(),
    in: z.array(TeamVisibilitySchema).nullish(),
    neq: TeamVisibilitySchema.nullish(),
    nin: z.array(TeamVisibilitySchema).nullish()
  })
}

export function TemplateCreateInputSchema(): z.ZodObject<Properties<TemplateCreateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    icon: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    pipelineId: z.string().nullish(),
    sortOrder: z.number().nullish(),
    teamId: z.string().nullish(),
    templateData: z.unknown(),
    type: z.string()
  })
}

export function TemplateUpdateInputSchema(): z.ZodObject<Properties<TemplateUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    icon: z.string().nullish(),
    name: z.string().nullish(),
    sortOrder: z.number().nullish(),
    teamId: z.string().nullish(),
    templateData: z.unknown().nullish()
  })
}

export function TierSortSchema(): z.ZodObject<Properties<TierSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function TimeInStatusSortSchema(): z.ZodObject<Properties<TimeInStatusSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function TimeScheduleCreateInputSchema(): z.ZodObject<Properties<TimeScheduleCreateInput>> {
  return z.object({
    entries: z.array(z.lazy(() => TimeScheduleEntryInputSchema())),
    externalId: z.string().nullish(),
    externalUrl: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string()
  })
}

export function TimeScheduleEntryInputSchema(): z.ZodObject<Properties<TimeScheduleEntryInput>> {
  return z.object({
    endsAt: z.string(),
    startsAt: z.string(),
    userEmail: z.string().nullish(),
    userId: z.string().nullish()
  })
}

export function TimeScheduleUpdateInputSchema(): z.ZodObject<Properties<TimeScheduleUpdateInput>> {
  return z.object({
    entries: z.array(z.lazy(() => TimeScheduleEntryInputSchema())).nullish(),
    externalId: z.string().nullish(),
    externalUrl: z.string().nullish(),
    name: z.string().nullish()
  })
}

export function TitleSortSchema(): z.ZodObject<Properties<TitleSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function TokenUserAccountAuthInputSchema(): z.ZodObject<Properties<TokenUserAccountAuthInput>> {
  return z.object({
    clientAuthCode: z.string().nullish(),
    email: z.string(),
    inviteLink: z.string().nullish(),
    timezone: z.string(),
    token: z.string()
  })
}

export function TriageResponsibilityCreateInputSchema(): z.ZodObject<Properties<TriageResponsibilityCreateInput>> {
  return z.object({
    action: z.string(),
    id: z.string().nullish(),
    manualSelection: z.lazy(() => TriageResponsibilityManualSelectionInputSchema().nullish()),
    teamId: z.string(),
    timeScheduleId: z.string().nullish()
  })
}

export function TriageResponsibilityManualSelectionInputSchema(): z.ZodObject<Properties<TriageResponsibilityManualSelectionInput>> {
  return z.object({
    assignmentIndex: z.number().nullish(),
    userIds: z.array(z.string())
  })
}

export function TriageResponsibilityUpdateInputSchema(): z.ZodObject<Properties<TriageResponsibilityUpdateInput>> {
  return z.object({
    action: z.string().nullish(),
    manualSelection: z.lazy(() => TriageResponsibilityManualSelectionInputSchema().nullish()),
    timeScheduleId: z.string().nullish()
  })
}

export function UpdatedAtSortSchema(): z.ZodObject<Properties<UpdatedAtSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function UserCollectionFilterSchema(): z.ZodObject<Properties<UserCollectionFilter>> {
  return z.object({
    active: z.lazy(() => BooleanComparatorSchema().nullish()),
    admin: z.lazy(() => BooleanComparatorSchema().nullish()),
    and: z.array(z.lazy(() => UserCollectionFilterSchema())).nullish(),
    app: z.lazy(() => BooleanComparatorSchema().nullish()),
    assignedIssues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    displayName: z.lazy(() => StringComparatorSchema().nullish()),
    email: z.lazy(() => StringComparatorSchema().nullish()),
    every: z.lazy(() => UserFilterSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    invited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isInvited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isMe: z.lazy(() => BooleanComparatorSchema().nullish()),
    length: z.lazy(() => NumberComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => UserCollectionFilterSchema())).nullish(),
    owner: z.lazy(() => BooleanComparatorSchema().nullish()),
    some: z.lazy(() => UserFilterSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function UserDisplayNameSortSchema(): z.ZodObject<Properties<UserDisplayNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function UserFilterSchema(): z.ZodObject<Properties<UserFilter>> {
  return z.object({
    active: z.lazy(() => BooleanComparatorSchema().nullish()),
    admin: z.lazy(() => BooleanComparatorSchema().nullish()),
    and: z.array(z.lazy(() => UserFilterSchema())).nullish(),
    app: z.lazy(() => BooleanComparatorSchema().nullish()),
    assignedIssues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    displayName: z.lazy(() => StringComparatorSchema().nullish()),
    email: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    invited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isInvited: z.lazy(() => BooleanComparatorSchema().nullish()),
    isMe: z.lazy(() => BooleanComparatorSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => UserFilterSchema())).nullish(),
    owner: z.lazy(() => BooleanComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function UserNameSortSchema(): z.ZodObject<Properties<UserNameSort>> {
  return z.object({
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function UserSettingsUpdateInputSchema(): z.ZodObject<Properties<UserSettingsUpdateInput>> {
  return z.object({
    feedLastSeenTime: z.string().nullish(),
    feedSummarySchedule: FeedSummaryScheduleSchema.nullish(),
    notificationCategoryPreferences: z.lazy(() => NotificationCategoryPreferencesInputSchema().nullish()),
    notificationChannelPreferences: z.lazy(() => PartialNotificationChannelPreferencesInputSchema().nullish()),
    notificationDeliveryPreferences: z.lazy(() => NotificationDeliveryPreferencesInputSchema().nullish()),
    settings: z.unknown().nullish(),
    subscribedToChangelog: z.boolean().nullish(),
    subscribedToDPA: z.boolean().nullish(),
    subscribedToGeneralMarketingCommunications: z.boolean().nullish(),
    subscribedToInviteAccepted: z.boolean().nullish(),
    subscribedToPrivacyLegalUpdates: z.boolean().nullish(),
    usageWarningHistory: z.unknown().nullish()
  })
}

export function UserSortInputSchema(): z.ZodObject<Properties<UserSortInput>> {
  return z.object({
    displayName: z.lazy(() => UserDisplayNameSortSchema().nullish()),
    name: z.lazy(() => UserNameSortSchema().nullish())
  })
}

export function UserUpdateInputSchema(): z.ZodObject<Properties<UserUpdateInput>> {
  return z.object({
    avatarUrl: z.string().nullish(),
    description: z.string().nullish(),
    displayName: z.string().nullish(),
    name: z.string().nullish(),
    statusEmoji: z.string().nullish(),
    statusLabel: z.string().nullish(),
    statusUntilAt: z.string().nullish(),
    timezone: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function ViewPreferencesCreateInputSchema(): z.ZodObject<Properties<ViewPreferencesCreateInput>> {
  return z.object({
    customViewId: z.string().nullish(),
    id: z.string().nullish(),
    initiativeId: z.string().nullish(),
    initiativeLabelId: z.string().nullish(),
    insights: z.unknown().nullish(),
    labelId: z.string().nullish(),
    preferences: z.unknown(),
    projectId: z.string().nullish(),
    projectLabelId: z.string().nullish(),
    releasePipelineId: z.string().nullish(),
    teamId: z.string().nullish(),
    type: ViewPreferencesTypeSchema,
    userId: z.string().nullish(),
    viewType: ViewTypeSchema
  })
}

export function ViewPreferencesUpdateInputSchema(): z.ZodObject<Properties<ViewPreferencesUpdateInput>> {
  return z.object({
    insights: z.unknown().nullish(),
    preferences: z.unknown().nullish()
  })
}

export function WebhookCreateInputSchema(): z.ZodObject<Properties<WebhookCreateInput>> {
  return z.object({
    allPublicTeams: z.boolean().nullish(),
    enabled: z.boolean().default(true).nullish(),
    id: z.string().nullish(),
    label: z.string().nullish(),
    resourceTypes: z.array(z.string()),
    secret: z.string().nullish(),
    teamId: z.string().nullish(),
    url: z.string()
  })
}

export function WebhookUpdateInputSchema(): z.ZodObject<Properties<WebhookUpdateInput>> {
  return z.object({
    enabled: z.boolean().nullish(),
    label: z.string().nullish(),
    resourceTypes: z.array(z.string()).nullish(),
    secret: z.string().nullish(),
    url: z.string().nullish()
  })
}

export function WorkflowStateCreateInputSchema(): z.ZodObject<Properties<WorkflowStateCreateInput>> {
  return z.object({
    color: z.string(),
    description: z.string().nullish(),
    id: z.string().nullish(),
    name: z.string(),
    position: z.number().nullish(),
    teamId: z.string(),
    type: z.string()
  })
}

export function WorkflowStateFilterSchema(): z.ZodObject<Properties<WorkflowStateFilter>> {
  return z.object({
    and: z.array(z.lazy(() => WorkflowStateFilterSchema())).nullish(),
    createdAt: z.lazy(() => DateComparatorSchema().nullish()),
    description: z.lazy(() => StringComparatorSchema().nullish()),
    id: z.lazy(() => IdComparatorSchema().nullish()),
    issues: z.lazy(() => IssueCollectionFilterSchema().nullish()),
    name: z.lazy(() => StringComparatorSchema().nullish()),
    or: z.array(z.lazy(() => WorkflowStateFilterSchema())).nullish(),
    position: z.lazy(() => NumberComparatorSchema().nullish()),
    team: z.lazy(() => TeamFilterSchema().nullish()),
    type: z.lazy(() => StringComparatorSchema().nullish()),
    updatedAt: z.lazy(() => DateComparatorSchema().nullish())
  })
}

export function WorkflowStateSortSchema(): z.ZodObject<Properties<WorkflowStateSort>> {
  return z.object({
    closedIssuesOrderedByRecency: z.boolean().default(false).nullish(),
    nulls: PaginationNullsSchema.default(PaginationNulls.Last).nullish(),
    order: PaginationSortOrderSchema.nullish()
  })
}

export function WorkflowStateUpdateInputSchema(): z.ZodObject<Properties<WorkflowStateUpdateInput>> {
  return z.object({
    color: z.string().nullish(),
    description: z.string().nullish(),
    name: z.string().nullish(),
    position: z.number().nullish()
  })
}

export function ZendeskSettingsInputSchema(): z.ZodObject<Properties<ZendeskSettingsInput>> {
  return z.object({
    automateTicketReopeningOnCancellation: z.boolean().nullish(),
    automateTicketReopeningOnComment: z.boolean().nullish(),
    automateTicketReopeningOnCompletion: z.boolean().nullish(),
    automateTicketReopeningOnProjectCancellation: z.boolean().nullish(),
    automateTicketReopeningOnProjectCompletion: z.boolean().nullish(),
    botUserId: z.string().nullish(),
    canReadCustomers: z.boolean().nullish(),
    disableCustomerRequestsAutoCreation: z.boolean().nullish(),
    enableAiIntake: z.boolean().nullish(),
    enableAiIntakeAttachmentProcessing: z.boolean().nullish(),
    hostMappings: z.array(z.string()).nullish(),
    sendNoteOnComment: z.boolean().nullish(),
    sendNoteOnStatusChange: z.boolean().nullish(),
    subdomain: z.string(),
    supportsOAuthRefresh: z.boolean().nullish(),
    url: z.string()
  })
}

export function LinearIssuesQuerySchema(): z.ZodType<LinearIssuesQuery> {
  return z.object({
    issues: z.object({
    nodes: z.array(z.object({
    identifier: z.string(),
    title: z.string(),
    url: z.string(),
    priority: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    team: z.object({
    key: z.string()
}),
    state: z.object({
    name: z.string(),
    type: z.string()
})
}))
})
})
}
