import { z } from 'zod'
import { AbortQueuedMigrationsInput, AbortRepositoryMigrationInput, AcceptEnterpriseAdministratorInvitationInput, AcceptEnterpriseMemberInvitationInput, AcceptTopicSuggestionInput, AccessUserNamespaceRepositoryInput, ActorType, AddAssigneesToAssignableInput, AddCommentInput, AddDiscussionCommentInput, AddDiscussionPollVoteInput, AddEnterpriseOrganizationMemberInput, AddEnterpriseSupportEntitlementInput, AddLabelsToLabelableInput, AddProjectCardInput, AddProjectColumnInput, AddProjectV2DraftIssueInput, AddProjectV2ItemByIdInput, AddPullRequestReviewCommentInput, AddPullRequestReviewInput, AddPullRequestReviewThreadInput, AddPullRequestReviewThreadReplyInput, AddReactionInput, AddStarInput, AddSubIssueInput, AddUpvoteInput, AddVerifiableDomainInput, ApproveDeploymentsInput, ApproveVerifiableDomainInput, ArchiveProjectV2ItemInput, ArchiveRepositoryInput, AuditLogOrder, AuditLogOrderField, BranchNamePatternParametersInput, BulkSponsorship, CancelEnterpriseAdminInvitationInput, CancelEnterpriseMemberInvitationInput, CancelSponsorshipInput, ChangeUserStatusInput, CheckAnnotationData, CheckAnnotationLevel, CheckAnnotationRange, CheckConclusionState, CheckRunAction, CheckRunFilter, CheckRunOutput, CheckRunOutputImage, CheckRunState, CheckRunType, CheckStatusState, CheckSuiteAutoTriggerPreference, CheckSuiteFilter, ClearLabelsFromLabelableInput, ClearProjectV2ItemFieldValueInput, CloneProjectInput, CloneTemplateRepositoryInput, CloseDiscussionInput, CloseIssueInput, ClosePullRequestInput, CodeScanningParametersInput, CodeScanningToolInput, CollaboratorAffiliation, CommentAuthorAssociation, CommentCannotUpdateReason, CommitAuthor, CommitAuthorEmailPatternParametersInput, CommitContributionOrder, CommitContributionOrderField, CommitMessage, CommitMessagePatternParametersInput, CommittableBranch, CommitterEmailPatternParametersInput, ComparisonStatus, ContributionLevel, ContributionOrder, ConvertProjectCardNoteToIssueInput, ConvertProjectV2DraftIssueItemToIssueInput, ConvertPullRequestToDraftInput, CopyProjectV2Input, CreateAttributionInvitationInput, CreateBranchProtectionRuleInput, CreateCheckRunInput, CreateCheckSuiteInput, CreateCommitOnBranchInput, CreateDeploymentInput, CreateDeploymentStatusInput, CreateDiscussionInput, CreateEnterpriseOrganizationInput, CreateEnvironmentInput, CreateIpAllowListEntryInput, CreateIssueInput, CreateLabelInput, CreateLinkedBranchInput, CreateMigrationSourceInput, CreateProjectInput, CreateProjectV2FieldInput, CreateProjectV2Input, CreateProjectV2StatusUpdateInput, CreatePullRequestInput, CreateRefInput, CreateRepositoryInput, CreateRepositoryRulesetInput, CreateSponsorsListingInput, CreateSponsorsTierInput, CreateSponsorshipInput, CreateSponsorshipsInput, CreateTeamDiscussionCommentInput, CreateTeamDiscussionInput, CreateUserListInput, DeclineTopicSuggestionInput, DefaultRepositoryPermissionField, DeleteBranchProtectionRuleInput, DeleteDeploymentInput, DeleteDiscussionCommentInput, DeleteDiscussionInput, DeleteEnvironmentInput, DeleteIpAllowListEntryInput, DeleteIssueCommentInput, DeleteIssueInput, DeleteLabelInput, DeleteLinkedBranchInput, DeletePackageVersionInput, DeleteProjectCardInput, DeleteProjectColumnInput, DeleteProjectInput, DeleteProjectV2FieldInput, DeleteProjectV2Input, DeleteProjectV2ItemInput, DeleteProjectV2StatusUpdateInput, DeleteProjectV2WorkflowInput, DeletePullRequestReviewCommentInput, DeletePullRequestReviewInput, DeleteRefInput, DeleteRepositoryRulesetInput, DeleteTeamDiscussionCommentInput, DeleteTeamDiscussionInput, DeleteUserListInput, DeleteVerifiableDomainInput, DependencyGraphEcosystem, DeploymentOrder, DeploymentOrderField, DeploymentProtectionRuleType, DeploymentReviewState, DeploymentState, DeploymentStatusState, DequeuePullRequestInput, DiffSide, DisablePullRequestAutoMergeInput, DiscussionCloseReason, DiscussionOrder, DiscussionOrderField, DiscussionPollOptionOrder, DiscussionPollOptionOrderField, DiscussionState, DiscussionStateReason, DismissPullRequestReviewInput, DismissReason, DismissRepositoryVulnerabilityAlertInput, DraftPullRequestReviewComment, DraftPullRequestReviewThread, EnablePullRequestAutoMergeInput, EnqueuePullRequestInput, EnterpriseAdministratorInvitationOrder, EnterpriseAdministratorInvitationOrderField, EnterpriseAdministratorRole, EnterpriseAllowPrivateRepositoryForkingPolicyValue, EnterpriseDefaultRepositoryPermissionSettingValue, EnterpriseDisallowedMethodsSettingValue, EnterpriseEnabledDisabledSettingValue, EnterpriseEnabledSettingValue, EnterpriseMemberInvitationOrder, EnterpriseMemberInvitationOrderField, EnterpriseMemberOrder, EnterpriseMemberOrderField, EnterpriseMembersCanCreateRepositoriesSettingValue, EnterpriseMembersCanMakePurchasesSettingValue, EnterpriseMembershipType, EnterpriseOrder, EnterpriseOrderField, EnterpriseServerInstallationOrder, EnterpriseServerInstallationOrderField, EnterpriseServerUserAccountEmailOrder, EnterpriseServerUserAccountEmailOrderField, EnterpriseServerUserAccountOrder, EnterpriseServerUserAccountOrderField, EnterpriseServerUserAccountsUploadOrder, EnterpriseServerUserAccountsUploadOrderField, EnterpriseServerUserAccountsUploadSyncState, EnterpriseUserAccountMembershipRole, EnterpriseUserDeployment, EnvironmentOrderField, EnvironmentPinnedFilterField, Environments, FileAddition, FileChanges, FileDeletion, FileExtensionRestrictionParametersInput, FilePathRestrictionParametersInput, FileViewedState, FollowOrganizationInput, FollowUserInput, FundingPlatform, GistOrder, GistOrderField, GistPrivacy, GitSignatureState, GrantEnterpriseOrganizationsMigratorRoleInput, GrantMigratorRoleInput, IdentityProviderConfigurationState, ImportProjectInput, InviteEnterpriseAdminInput, InviteEnterpriseMemberInput, IpAllowListEnabledSettingValue, IpAllowListEntryOrder, IpAllowListEntryOrderField, IpAllowListForInstalledAppsEnabledSettingValue, IssueClosedStateReason, IssueCommentOrder, IssueCommentOrderField, IssueFilters, IssueOrder, IssueOrderField, IssueState, IssueStateReason, IssueTimelineItemsItemType, LabelOrder, LabelOrderField, LanguageOrder, LanguageOrderField, LinkProjectV2ToRepositoryInput, LinkProjectV2ToTeamInput, LinkRepositoryToProjectInput, LockLockableInput, LockReason, MannequinOrder, MannequinOrderField, MarkDiscussionCommentAsAnswerInput, MarkFileAsViewedInput, MarkProjectV2AsTemplateInput, MarkPullRequestReadyForReviewInput, MaxFilePathLengthParametersInput, MaxFileSizeParametersInput, MergeBranchInput, MergeCommitMessage, MergeCommitTitle, MergePullRequestInput, MergeQueueEntryState, MergeQueueGroupingStrategy, MergeQueueMergeMethod, MergeQueueMergingStrategy, MergeQueueParametersInput, MergeStateStatus, MergeableState, MigrationSourceType, MigrationState, MilestoneOrder, MilestoneOrderField, MilestoneState, MinimizeCommentInput, MoveProjectCardInput, MoveProjectColumnInput, NotificationRestrictionSettingValue, OidcProviderType, OauthApplicationCreateAuditEntryState, OperationType, OrderDirection, OrgAddMemberAuditEntryPermission, OrgCreateAuditEntryBillingPlan, OrgEnterpriseOwnerOrder, OrgEnterpriseOwnerOrderField, OrgRemoveBillingManagerAuditEntryReason, OrgRemoveMemberAuditEntryMembershipType, OrgRemoveMemberAuditEntryReason, OrgRemoveOutsideCollaboratorAuditEntryMembershipType, OrgRemoveOutsideCollaboratorAuditEntryReason, OrgUpdateDefaultRepositoryPermissionAuditEntryPermission, OrgUpdateMemberAuditEntryPermission, OrgUpdateMemberRepositoryCreationPermissionAuditEntryVisibility, OrganizationInvitationRole, OrganizationInvitationSource, OrganizationInvitationType, OrganizationMemberRole, OrganizationMembersCanCreateRepositoriesSettingValue, OrganizationMigrationState, OrganizationOrder, OrganizationOrderField, PackageFileOrder, PackageFileOrderField, PackageOrder, PackageOrderField, PackageType, PackageVersionOrder, PackageVersionOrderField, PatchStatus, PinEnvironmentInput, PinIssueInput, PinnableItemType, PinnedDiscussionGradient, PinnedDiscussionPattern, PinnedEnvironmentOrder, PinnedEnvironmentOrderField, ProjectCardArchivedState, ProjectCardImport, ProjectCardState, ProjectColumnImport, ProjectColumnPurpose, ProjectOrder, ProjectOrderField, ProjectState, ProjectTemplate, ProjectV2Collaborator, ProjectV2CustomFieldType, ProjectV2FieldOrder, ProjectV2FieldOrderField, ProjectV2FieldType, ProjectV2FieldValue, ProjectV2Filters, ProjectV2ItemFieldValueOrder, ProjectV2ItemFieldValueOrderField, ProjectV2ItemOrder, ProjectV2ItemOrderField, ProjectV2ItemType, ProjectV2Iteration, ProjectV2IterationFieldConfigurationInput, ProjectV2Order, ProjectV2OrderField, ProjectV2PermissionLevel, ProjectV2Roles, ProjectV2SingleSelectFieldOptionColor, ProjectV2SingleSelectFieldOptionInput, ProjectV2State, ProjectV2StatusOrder, ProjectV2StatusUpdateOrderField, ProjectV2StatusUpdateStatus, ProjectV2ViewLayout, ProjectV2ViewOrder, ProjectV2ViewOrderField, ProjectV2WorkflowOrder, ProjectV2WorkflowsOrderField, PropertyTargetDefinitionInput, PublishSponsorsTierInput, PullRequestBranchUpdateMethod, PullRequestMergeMethod, PullRequestOrder, PullRequestOrderField, PullRequestParametersInput, PullRequestReviewCommentState, PullRequestReviewDecision, PullRequestReviewEvent, PullRequestReviewState, PullRequestReviewThreadSubjectType, PullRequestState, PullRequestTimelineItemsItemType, PullRequestUpdateState, ReactionContent, ReactionOrder, ReactionOrderField, RefNameConditionTargetInput, RefOrder, RefOrderField, RefUpdate, RegenerateEnterpriseIdentityProviderRecoveryCodesInput, RegenerateVerifiableDomainTokenInput, RejectDeploymentsInput, ReleaseOrder, ReleaseOrderField, RemoveAssigneesFromAssignableInput, RemoveEnterpriseAdminInput, RemoveEnterpriseIdentityProviderInput, RemoveEnterpriseMemberInput, RemoveEnterpriseOrganizationInput, RemoveEnterpriseSupportEntitlementInput, RemoveLabelsFromLabelableInput, RemoveOutsideCollaboratorInput, RemoveReactionInput, RemoveStarInput, RemoveSubIssueInput, RemoveUpvoteInput, ReopenDiscussionInput, ReopenIssueInput, ReopenPullRequestInput, ReorderEnvironmentInput, RepoAccessAuditEntryVisibility, RepoAddMemberAuditEntryVisibility, RepoArchivedAuditEntryVisibility, RepoChangeMergeSettingAuditEntryMergeType, RepoCreateAuditEntryVisibility, RepoDestroyAuditEntryVisibility, RepoRemoveMemberAuditEntryVisibility, ReportedContentClassifiers, RepositoryAffiliation, RepositoryContributionType, RepositoryIdConditionTargetInput, RepositoryInteractionLimit, RepositoryInteractionLimitExpiry, RepositoryInteractionLimitOrigin, RepositoryInvitationOrder, RepositoryInvitationOrderField, RepositoryLockReason, RepositoryMigrationOrder, RepositoryMigrationOrderDirection, RepositoryMigrationOrderField, RepositoryNameConditionTargetInput, RepositoryOrder, RepositoryOrderField, RepositoryPermission, RepositoryPrivacy, RepositoryPropertyConditionTargetInput, RepositoryRuleConditionsInput, RepositoryRuleInput, RepositoryRuleOrder, RepositoryRuleOrderField, RepositoryRuleType, RepositoryRulesetBypassActorBypassMode, RepositoryRulesetBypassActorInput, RepositoryRulesetTarget, RepositoryVisibility, RepositoryVulnerabilityAlertDependencyScope, RepositoryVulnerabilityAlertState, ReprioritizeSubIssueInput, RequestReviewsInput, RequestableCheckStatusState, RequiredDeploymentsParametersInput, RequiredStatusCheckInput, RequiredStatusChecksParametersInput, RerequestCheckSuiteInput, ResolveReviewThreadInput, RetireSponsorsTierInput, RevertPullRequestInput, RevokeEnterpriseOrganizationsMigratorRoleInput, RevokeMigratorRoleInput, RoleInOrganization, RuleEnforcement, RuleParametersInput, SamlDigestAlgorithm, SamlSignatureAlgorithm, SavedReplyOrder, SavedReplyOrderField, SearchType, SecurityAdvisoryClassification, SecurityAdvisoryEcosystem, SecurityAdvisoryIdentifierFilter, SecurityAdvisoryIdentifierType, SecurityAdvisoryOrder, SecurityAdvisoryOrderField, SecurityAdvisorySeverity, SecurityVulnerabilityOrder, SecurityVulnerabilityOrderField, SetEnterpriseIdentityProviderInput, SetOrganizationInteractionLimitInput, SetRepositoryInteractionLimitInput, SetUserInteractionLimitInput, SocialAccountProvider, SponsorAndLifetimeValueOrder, SponsorAndLifetimeValueOrderField, SponsorOrder, SponsorOrderField, SponsorableOrder, SponsorableOrderField, SponsorsActivityAction, SponsorsActivityOrder, SponsorsActivityOrderField, SponsorsActivityPeriod, SponsorsCountryOrRegionCode, SponsorsGoalKind, SponsorsListingFeaturedItemFeatureableType, SponsorsTierOrder, SponsorsTierOrderField, SponsorshipNewsletterOrder, SponsorshipNewsletterOrderField, SponsorshipOrder, SponsorshipOrderField, SponsorshipPaymentSource, SponsorshipPrivacy, SquashMergeCommitMessage, SquashMergeCommitTitle, StarOrder, StarOrderField, StartOrganizationMigrationInput, StartRepositoryMigrationInput, StatusCheckConfigurationInput, StatusState, SubmitPullRequestReviewInput, SubscriptionState, TagNamePatternParametersInput, TeamDiscussionCommentOrder, TeamDiscussionCommentOrderField, TeamDiscussionOrder, TeamDiscussionOrderField, TeamMemberOrder, TeamMemberOrderField, TeamMemberRole, TeamMembershipType, TeamNotificationSetting, TeamOrder, TeamOrderField, TeamPrivacy, TeamRepositoryOrder, TeamRepositoryOrderField, TeamReviewAssignmentAlgorithm, TeamRole, ThreadSubscriptionFormAction, ThreadSubscriptionState, TopicSuggestionDeclineReason, TrackedIssueStates, TransferEnterpriseOrganizationInput, TransferIssueInput, TwoFactorCredentialSecurityType, UnarchiveProjectV2ItemInput, UnarchiveRepositoryInput, UnfollowOrganizationInput, UnfollowUserInput, UnlinkProjectV2FromRepositoryInput, UnlinkProjectV2FromTeamInput, UnlinkRepositoryFromProjectInput, UnlockLockableInput, UnmarkDiscussionCommentAsAnswerInput, UnmarkFileAsViewedInput, UnmarkIssueAsDuplicateInput, UnmarkProjectV2AsTemplateInput, UnminimizeCommentInput, UnpinIssueInput, UnresolveReviewThreadInput, UpdateBranchProtectionRuleInput, UpdateCheckRunInput, UpdateCheckSuitePreferencesInput, UpdateDiscussionCommentInput, UpdateDiscussionInput, UpdateEnterpriseAdministratorRoleInput, UpdateEnterpriseAllowPrivateRepositoryForkingSettingInput, UpdateEnterpriseDefaultRepositoryPermissionSettingInput, UpdateEnterpriseDeployKeySettingInput, UpdateEnterpriseMembersCanChangeRepositoryVisibilitySettingInput, UpdateEnterpriseMembersCanCreateRepositoriesSettingInput, UpdateEnterpriseMembersCanDeleteIssuesSettingInput, UpdateEnterpriseMembersCanDeleteRepositoriesSettingInput, UpdateEnterpriseMembersCanInviteCollaboratorsSettingInput, UpdateEnterpriseMembersCanMakePurchasesSettingInput, UpdateEnterpriseMembersCanUpdateProtectedBranchesSettingInput, UpdateEnterpriseMembersCanViewDependencyInsightsSettingInput, UpdateEnterpriseOrganizationProjectsSettingInput, UpdateEnterpriseOwnerOrganizationRoleInput, UpdateEnterpriseProfileInput, UpdateEnterpriseRepositoryProjectsSettingInput, UpdateEnterpriseTeamDiscussionsSettingInput, UpdateEnterpriseTwoFactorAuthenticationDisallowedMethodsSettingInput, UpdateEnterpriseTwoFactorAuthenticationRequiredSettingInput, UpdateEnvironmentInput, UpdateIpAllowListEnabledSettingInput, UpdateIpAllowListEntryInput, UpdateIpAllowListForInstalledAppsEnabledSettingInput, UpdateIssueCommentInput, UpdateIssueInput, UpdateLabelInput, UpdateNotificationRestrictionSettingInput, UpdateOrganizationAllowPrivateRepositoryForkingSettingInput, UpdateOrganizationWebCommitSignoffSettingInput, UpdateParametersInput, UpdatePatreonSponsorabilityInput, UpdateProjectCardInput, UpdateProjectColumnInput, UpdateProjectInput, UpdateProjectV2CollaboratorsInput, UpdateProjectV2DraftIssueInput, UpdateProjectV2FieldInput, UpdateProjectV2Input, UpdateProjectV2ItemFieldValueInput, UpdateProjectV2ItemPositionInput, UpdateProjectV2StatusUpdateInput, UpdatePullRequestBranchInput, UpdatePullRequestInput, UpdatePullRequestReviewCommentInput, UpdatePullRequestReviewInput, UpdateRefInput, UpdateRefsInput, UpdateRepositoryInput, UpdateRepositoryRulesetInput, UpdateRepositoryWebCommitSignoffSettingInput, UpdateSponsorshipPreferencesInput, UpdateSubscriptionInput, UpdateTeamDiscussionCommentInput, UpdateTeamDiscussionInput, UpdateTeamReviewAssignmentInput, UpdateTeamsRepositoryInput, UpdateTopicsInput, UpdateUserListInput, UpdateUserListsForItemInput, UserBlockDuration, UserStatusOrder, UserStatusOrderField, UserViewType, VerifiableDomainOrder, VerifiableDomainOrderField, VerifyVerifiableDomainInput, WorkflowFileReferenceInput, WorkflowRunOrder, WorkflowRunOrderField, WorkflowState, WorkflowsParametersInput, SearchPrsQuery } from './github-types'

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny => v !== undefined && v !== null;

export const definedNonNullAnySchema = z.any().refine((v) => isDefinedNonNullAny(v));

export const ActorTypeSchema: z.ZodType<ActorType> = z.nativeEnum(ActorType);

export const AuditLogOrderFieldSchema: z.ZodType<AuditLogOrderField> = z.nativeEnum(AuditLogOrderField);

export const CheckAnnotationLevelSchema: z.ZodType<CheckAnnotationLevel> = z.nativeEnum(CheckAnnotationLevel);

export const CheckConclusionStateSchema: z.ZodType<CheckConclusionState> = z.nativeEnum(CheckConclusionState);

export const CheckRunStateSchema: z.ZodType<CheckRunState> = z.nativeEnum(CheckRunState);

export const CheckRunTypeSchema: z.ZodType<CheckRunType> = z.nativeEnum(CheckRunType);

export const CheckStatusStateSchema: z.ZodType<CheckStatusState> = z.nativeEnum(CheckStatusState);

export const CollaboratorAffiliationSchema: z.ZodType<CollaboratorAffiliation> = z.nativeEnum(CollaboratorAffiliation);

export const CommentAuthorAssociationSchema: z.ZodType<CommentAuthorAssociation> = z.nativeEnum(CommentAuthorAssociation);

export const CommentCannotUpdateReasonSchema: z.ZodType<CommentCannotUpdateReason> = z.nativeEnum(CommentCannotUpdateReason);

export const CommitContributionOrderFieldSchema: z.ZodType<CommitContributionOrderField> = z.nativeEnum(CommitContributionOrderField);

export const ComparisonStatusSchema: z.ZodType<ComparisonStatus> = z.nativeEnum(ComparisonStatus);

export const ContributionLevelSchema: z.ZodType<ContributionLevel> = z.nativeEnum(ContributionLevel);

export const DefaultRepositoryPermissionFieldSchema: z.ZodType<DefaultRepositoryPermissionField> = z.nativeEnum(DefaultRepositoryPermissionField);

export const DependencyGraphEcosystemSchema: z.ZodType<DependencyGraphEcosystem> = z.nativeEnum(DependencyGraphEcosystem);

export const DeploymentOrderFieldSchema: z.ZodType<DeploymentOrderField> = z.nativeEnum(DeploymentOrderField);

export const DeploymentProtectionRuleTypeSchema: z.ZodType<DeploymentProtectionRuleType> = z.nativeEnum(DeploymentProtectionRuleType);

export const DeploymentReviewStateSchema: z.ZodType<DeploymentReviewState> = z.nativeEnum(DeploymentReviewState);

export const DeploymentStateSchema: z.ZodType<DeploymentState> = z.nativeEnum(DeploymentState);

export const DeploymentStatusStateSchema: z.ZodType<DeploymentStatusState> = z.nativeEnum(DeploymentStatusState);

export const DiffSideSchema: z.ZodType<DiffSide> = z.nativeEnum(DiffSide);

export const DiscussionCloseReasonSchema: z.ZodType<DiscussionCloseReason> = z.nativeEnum(DiscussionCloseReason);

export const DiscussionOrderFieldSchema: z.ZodType<DiscussionOrderField> = z.nativeEnum(DiscussionOrderField);

export const DiscussionPollOptionOrderFieldSchema: z.ZodType<DiscussionPollOptionOrderField> = z.nativeEnum(DiscussionPollOptionOrderField);

export const DiscussionStateSchema: z.ZodType<DiscussionState> = z.nativeEnum(DiscussionState);

export const DiscussionStateReasonSchema: z.ZodType<DiscussionStateReason> = z.nativeEnum(DiscussionStateReason);

export const DismissReasonSchema: z.ZodType<DismissReason> = z.nativeEnum(DismissReason);

export const EnterpriseAdministratorInvitationOrderFieldSchema: z.ZodType<EnterpriseAdministratorInvitationOrderField> = z.nativeEnum(EnterpriseAdministratorInvitationOrderField);

export const EnterpriseAdministratorRoleSchema: z.ZodType<EnterpriseAdministratorRole> = z.nativeEnum(EnterpriseAdministratorRole);

export const EnterpriseAllowPrivateRepositoryForkingPolicyValueSchema: z.ZodType<EnterpriseAllowPrivateRepositoryForkingPolicyValue> = z.nativeEnum(EnterpriseAllowPrivateRepositoryForkingPolicyValue);

export const EnterpriseDefaultRepositoryPermissionSettingValueSchema: z.ZodType<EnterpriseDefaultRepositoryPermissionSettingValue> = z.nativeEnum(EnterpriseDefaultRepositoryPermissionSettingValue);

export const EnterpriseDisallowedMethodsSettingValueSchema: z.ZodType<EnterpriseDisallowedMethodsSettingValue> = z.nativeEnum(EnterpriseDisallowedMethodsSettingValue);

export const EnterpriseEnabledDisabledSettingValueSchema: z.ZodType<EnterpriseEnabledDisabledSettingValue> = z.nativeEnum(EnterpriseEnabledDisabledSettingValue);

export const EnterpriseEnabledSettingValueSchema: z.ZodType<EnterpriseEnabledSettingValue> = z.nativeEnum(EnterpriseEnabledSettingValue);

export const EnterpriseMemberInvitationOrderFieldSchema: z.ZodType<EnterpriseMemberInvitationOrderField> = z.nativeEnum(EnterpriseMemberInvitationOrderField);

export const EnterpriseMemberOrderFieldSchema: z.ZodType<EnterpriseMemberOrderField> = z.nativeEnum(EnterpriseMemberOrderField);

export const EnterpriseMembersCanCreateRepositoriesSettingValueSchema: z.ZodType<EnterpriseMembersCanCreateRepositoriesSettingValue> = z.nativeEnum(EnterpriseMembersCanCreateRepositoriesSettingValue);

export const EnterpriseMembersCanMakePurchasesSettingValueSchema: z.ZodType<EnterpriseMembersCanMakePurchasesSettingValue> = z.nativeEnum(EnterpriseMembersCanMakePurchasesSettingValue);

export const EnterpriseMembershipTypeSchema: z.ZodType<EnterpriseMembershipType> = z.nativeEnum(EnterpriseMembershipType);

export const EnterpriseOrderFieldSchema: z.ZodType<EnterpriseOrderField> = z.nativeEnum(EnterpriseOrderField);

export const EnterpriseServerInstallationOrderFieldSchema: z.ZodType<EnterpriseServerInstallationOrderField> = z.nativeEnum(EnterpriseServerInstallationOrderField);

export const EnterpriseServerUserAccountEmailOrderFieldSchema: z.ZodType<EnterpriseServerUserAccountEmailOrderField> = z.nativeEnum(EnterpriseServerUserAccountEmailOrderField);

export const EnterpriseServerUserAccountOrderFieldSchema: z.ZodType<EnterpriseServerUserAccountOrderField> = z.nativeEnum(EnterpriseServerUserAccountOrderField);

export const EnterpriseServerUserAccountsUploadOrderFieldSchema: z.ZodType<EnterpriseServerUserAccountsUploadOrderField> = z.nativeEnum(EnterpriseServerUserAccountsUploadOrderField);

export const EnterpriseServerUserAccountsUploadSyncStateSchema: z.ZodType<EnterpriseServerUserAccountsUploadSyncState> = z.nativeEnum(EnterpriseServerUserAccountsUploadSyncState);

export const EnterpriseUserAccountMembershipRoleSchema: z.ZodType<EnterpriseUserAccountMembershipRole> = z.nativeEnum(EnterpriseUserAccountMembershipRole);

export const EnterpriseUserDeploymentSchema: z.ZodType<EnterpriseUserDeployment> = z.nativeEnum(EnterpriseUserDeployment);

export const EnvironmentOrderFieldSchema: z.ZodType<EnvironmentOrderField> = z.nativeEnum(EnvironmentOrderField);

export const EnvironmentPinnedFilterFieldSchema: z.ZodType<EnvironmentPinnedFilterField> = z.nativeEnum(EnvironmentPinnedFilterField);

export const FileViewedStateSchema: z.ZodType<FileViewedState> = z.nativeEnum(FileViewedState);

export const FundingPlatformSchema: z.ZodType<FundingPlatform> = z.nativeEnum(FundingPlatform);

export const GistOrderFieldSchema: z.ZodType<GistOrderField> = z.nativeEnum(GistOrderField);

export const GistPrivacySchema: z.ZodType<GistPrivacy> = z.nativeEnum(GistPrivacy);

export const GitSignatureStateSchema: z.ZodType<GitSignatureState> = z.nativeEnum(GitSignatureState);

export const IdentityProviderConfigurationStateSchema: z.ZodType<IdentityProviderConfigurationState> = z.nativeEnum(IdentityProviderConfigurationState);

export const IpAllowListEnabledSettingValueSchema: z.ZodType<IpAllowListEnabledSettingValue> = z.nativeEnum(IpAllowListEnabledSettingValue);

export const IpAllowListEntryOrderFieldSchema: z.ZodType<IpAllowListEntryOrderField> = z.nativeEnum(IpAllowListEntryOrderField);

export const IpAllowListForInstalledAppsEnabledSettingValueSchema: z.ZodType<IpAllowListForInstalledAppsEnabledSettingValue> = z.nativeEnum(IpAllowListForInstalledAppsEnabledSettingValue);

export const IssueClosedStateReasonSchema: z.ZodType<IssueClosedStateReason> = z.nativeEnum(IssueClosedStateReason);

export const IssueCommentOrderFieldSchema: z.ZodType<IssueCommentOrderField> = z.nativeEnum(IssueCommentOrderField);

export const IssueOrderFieldSchema: z.ZodType<IssueOrderField> = z.nativeEnum(IssueOrderField);

export const IssueStateSchema: z.ZodType<IssueState> = z.nativeEnum(IssueState);

export const IssueStateReasonSchema: z.ZodType<IssueStateReason> = z.nativeEnum(IssueStateReason);

export const IssueTimelineItemsItemTypeSchema: z.ZodType<IssueTimelineItemsItemType> = z.nativeEnum(IssueTimelineItemsItemType);

export const LabelOrderFieldSchema: z.ZodType<LabelOrderField> = z.nativeEnum(LabelOrderField);

export const LanguageOrderFieldSchema: z.ZodType<LanguageOrderField> = z.nativeEnum(LanguageOrderField);

export const LockReasonSchema: z.ZodType<LockReason> = z.nativeEnum(LockReason);

export const MannequinOrderFieldSchema: z.ZodType<MannequinOrderField> = z.nativeEnum(MannequinOrderField);

export const MergeCommitMessageSchema: z.ZodType<MergeCommitMessage> = z.nativeEnum(MergeCommitMessage);

export const MergeCommitTitleSchema: z.ZodType<MergeCommitTitle> = z.nativeEnum(MergeCommitTitle);

export const MergeQueueEntryStateSchema: z.ZodType<MergeQueueEntryState> = z.nativeEnum(MergeQueueEntryState);

export const MergeQueueGroupingStrategySchema: z.ZodType<MergeQueueGroupingStrategy> = z.nativeEnum(MergeQueueGroupingStrategy);

export const MergeQueueMergeMethodSchema: z.ZodType<MergeQueueMergeMethod> = z.nativeEnum(MergeQueueMergeMethod);

export const MergeQueueMergingStrategySchema: z.ZodType<MergeQueueMergingStrategy> = z.nativeEnum(MergeQueueMergingStrategy);

export const MergeStateStatusSchema: z.ZodType<MergeStateStatus> = z.nativeEnum(MergeStateStatus);

export const MergeableStateSchema: z.ZodType<MergeableState> = z.nativeEnum(MergeableState);

export const MigrationSourceTypeSchema: z.ZodType<MigrationSourceType> = z.nativeEnum(MigrationSourceType);

export const MigrationStateSchema: z.ZodType<MigrationState> = z.nativeEnum(MigrationState);

export const MilestoneOrderFieldSchema: z.ZodType<MilestoneOrderField> = z.nativeEnum(MilestoneOrderField);

export const MilestoneStateSchema: z.ZodType<MilestoneState> = z.nativeEnum(MilestoneState);

export const NotificationRestrictionSettingValueSchema: z.ZodType<NotificationRestrictionSettingValue> = z.nativeEnum(NotificationRestrictionSettingValue);

export const OidcProviderTypeSchema: z.ZodType<OidcProviderType> = z.nativeEnum(OidcProviderType);

export const OauthApplicationCreateAuditEntryStateSchema: z.ZodType<OauthApplicationCreateAuditEntryState> = z.nativeEnum(OauthApplicationCreateAuditEntryState);

export const OperationTypeSchema: z.ZodType<OperationType> = z.nativeEnum(OperationType);

export const OrderDirectionSchema: z.ZodType<OrderDirection> = z.nativeEnum(OrderDirection);

export const OrgAddMemberAuditEntryPermissionSchema: z.ZodType<OrgAddMemberAuditEntryPermission> = z.nativeEnum(OrgAddMemberAuditEntryPermission);

export const OrgCreateAuditEntryBillingPlanSchema: z.ZodType<OrgCreateAuditEntryBillingPlan> = z.nativeEnum(OrgCreateAuditEntryBillingPlan);

export const OrgEnterpriseOwnerOrderFieldSchema: z.ZodType<OrgEnterpriseOwnerOrderField> = z.nativeEnum(OrgEnterpriseOwnerOrderField);

export const OrgRemoveBillingManagerAuditEntryReasonSchema: z.ZodType<OrgRemoveBillingManagerAuditEntryReason> = z.nativeEnum(OrgRemoveBillingManagerAuditEntryReason);

export const OrgRemoveMemberAuditEntryMembershipTypeSchema: z.ZodType<OrgRemoveMemberAuditEntryMembershipType> = z.nativeEnum(OrgRemoveMemberAuditEntryMembershipType);

export const OrgRemoveMemberAuditEntryReasonSchema: z.ZodType<OrgRemoveMemberAuditEntryReason> = z.nativeEnum(OrgRemoveMemberAuditEntryReason);

export const OrgRemoveOutsideCollaboratorAuditEntryMembershipTypeSchema: z.ZodType<OrgRemoveOutsideCollaboratorAuditEntryMembershipType> = z.nativeEnum(OrgRemoveOutsideCollaboratorAuditEntryMembershipType);

export const OrgRemoveOutsideCollaboratorAuditEntryReasonSchema: z.ZodType<OrgRemoveOutsideCollaboratorAuditEntryReason> = z.nativeEnum(OrgRemoveOutsideCollaboratorAuditEntryReason);

export const OrgUpdateDefaultRepositoryPermissionAuditEntryPermissionSchema: z.ZodType<OrgUpdateDefaultRepositoryPermissionAuditEntryPermission> = z.nativeEnum(OrgUpdateDefaultRepositoryPermissionAuditEntryPermission);

export const OrgUpdateMemberAuditEntryPermissionSchema: z.ZodType<OrgUpdateMemberAuditEntryPermission> = z.nativeEnum(OrgUpdateMemberAuditEntryPermission);

export const OrgUpdateMemberRepositoryCreationPermissionAuditEntryVisibilitySchema: z.ZodType<OrgUpdateMemberRepositoryCreationPermissionAuditEntryVisibility> = z.nativeEnum(OrgUpdateMemberRepositoryCreationPermissionAuditEntryVisibility);

export const OrganizationInvitationRoleSchema: z.ZodType<OrganizationInvitationRole> = z.nativeEnum(OrganizationInvitationRole);

export const OrganizationInvitationSourceSchema: z.ZodType<OrganizationInvitationSource> = z.nativeEnum(OrganizationInvitationSource);

export const OrganizationInvitationTypeSchema: z.ZodType<OrganizationInvitationType> = z.nativeEnum(OrganizationInvitationType);

export const OrganizationMemberRoleSchema: z.ZodType<OrganizationMemberRole> = z.nativeEnum(OrganizationMemberRole);

export const OrganizationMembersCanCreateRepositoriesSettingValueSchema: z.ZodType<OrganizationMembersCanCreateRepositoriesSettingValue> = z.nativeEnum(OrganizationMembersCanCreateRepositoriesSettingValue);

export const OrganizationMigrationStateSchema: z.ZodType<OrganizationMigrationState> = z.nativeEnum(OrganizationMigrationState);

export const OrganizationOrderFieldSchema: z.ZodType<OrganizationOrderField> = z.nativeEnum(OrganizationOrderField);

export const PackageFileOrderFieldSchema: z.ZodType<PackageFileOrderField> = z.nativeEnum(PackageFileOrderField);

export const PackageOrderFieldSchema: z.ZodType<PackageOrderField> = z.nativeEnum(PackageOrderField);

export const PackageTypeSchema: z.ZodType<PackageType> = z.nativeEnum(PackageType);

export const PackageVersionOrderFieldSchema: z.ZodType<PackageVersionOrderField> = z.nativeEnum(PackageVersionOrderField);

export const PatchStatusSchema: z.ZodType<PatchStatus> = z.nativeEnum(PatchStatus);

export const PinnableItemTypeSchema: z.ZodType<PinnableItemType> = z.nativeEnum(PinnableItemType);

export const PinnedDiscussionGradientSchema: z.ZodType<PinnedDiscussionGradient> = z.nativeEnum(PinnedDiscussionGradient);

export const PinnedDiscussionPatternSchema: z.ZodType<PinnedDiscussionPattern> = z.nativeEnum(PinnedDiscussionPattern);

export const PinnedEnvironmentOrderFieldSchema: z.ZodType<PinnedEnvironmentOrderField> = z.nativeEnum(PinnedEnvironmentOrderField);

export const ProjectCardArchivedStateSchema: z.ZodType<ProjectCardArchivedState> = z.nativeEnum(ProjectCardArchivedState);

export const ProjectCardStateSchema: z.ZodType<ProjectCardState> = z.nativeEnum(ProjectCardState);

export const ProjectColumnPurposeSchema: z.ZodType<ProjectColumnPurpose> = z.nativeEnum(ProjectColumnPurpose);

export const ProjectOrderFieldSchema: z.ZodType<ProjectOrderField> = z.nativeEnum(ProjectOrderField);

export const ProjectStateSchema: z.ZodType<ProjectState> = z.nativeEnum(ProjectState);

export const ProjectTemplateSchema: z.ZodType<ProjectTemplate> = z.nativeEnum(ProjectTemplate);

export const ProjectV2CustomFieldTypeSchema: z.ZodType<ProjectV2CustomFieldType> = z.nativeEnum(ProjectV2CustomFieldType);

export const ProjectV2FieldOrderFieldSchema: z.ZodType<ProjectV2FieldOrderField> = z.nativeEnum(ProjectV2FieldOrderField);

export const ProjectV2FieldTypeSchema: z.ZodType<ProjectV2FieldType> = z.nativeEnum(ProjectV2FieldType);

export const ProjectV2ItemFieldValueOrderFieldSchema: z.ZodType<ProjectV2ItemFieldValueOrderField> = z.nativeEnum(ProjectV2ItemFieldValueOrderField);

export const ProjectV2ItemOrderFieldSchema: z.ZodType<ProjectV2ItemOrderField> = z.nativeEnum(ProjectV2ItemOrderField);

export const ProjectV2ItemTypeSchema: z.ZodType<ProjectV2ItemType> = z.nativeEnum(ProjectV2ItemType);

export const ProjectV2OrderFieldSchema: z.ZodType<ProjectV2OrderField> = z.nativeEnum(ProjectV2OrderField);

export const ProjectV2PermissionLevelSchema: z.ZodType<ProjectV2PermissionLevel> = z.nativeEnum(ProjectV2PermissionLevel);

export const ProjectV2RolesSchema: z.ZodType<ProjectV2Roles> = z.nativeEnum(ProjectV2Roles);

export const ProjectV2SingleSelectFieldOptionColorSchema: z.ZodType<ProjectV2SingleSelectFieldOptionColor> = z.nativeEnum(ProjectV2SingleSelectFieldOptionColor);

export const ProjectV2StateSchema: z.ZodType<ProjectV2State> = z.nativeEnum(ProjectV2State);

export const ProjectV2StatusUpdateOrderFieldSchema: z.ZodType<ProjectV2StatusUpdateOrderField> = z.nativeEnum(ProjectV2StatusUpdateOrderField);

export const ProjectV2StatusUpdateStatusSchema: z.ZodType<ProjectV2StatusUpdateStatus> = z.nativeEnum(ProjectV2StatusUpdateStatus);

export const ProjectV2ViewLayoutSchema: z.ZodType<ProjectV2ViewLayout> = z.nativeEnum(ProjectV2ViewLayout);

export const ProjectV2ViewOrderFieldSchema: z.ZodType<ProjectV2ViewOrderField> = z.nativeEnum(ProjectV2ViewOrderField);

export const ProjectV2WorkflowsOrderFieldSchema: z.ZodType<ProjectV2WorkflowsOrderField> = z.nativeEnum(ProjectV2WorkflowsOrderField);

export const PullRequestBranchUpdateMethodSchema: z.ZodType<PullRequestBranchUpdateMethod> = z.nativeEnum(PullRequestBranchUpdateMethod);

export const PullRequestMergeMethodSchema: z.ZodType<PullRequestMergeMethod> = z.nativeEnum(PullRequestMergeMethod);

export const PullRequestOrderFieldSchema: z.ZodType<PullRequestOrderField> = z.nativeEnum(PullRequestOrderField);

export const PullRequestReviewCommentStateSchema: z.ZodType<PullRequestReviewCommentState> = z.nativeEnum(PullRequestReviewCommentState);

export const PullRequestReviewDecisionSchema: z.ZodType<PullRequestReviewDecision> = z.nativeEnum(PullRequestReviewDecision);

export const PullRequestReviewEventSchema: z.ZodType<PullRequestReviewEvent> = z.nativeEnum(PullRequestReviewEvent);

export const PullRequestReviewStateSchema: z.ZodType<PullRequestReviewState> = z.nativeEnum(PullRequestReviewState);

export const PullRequestReviewThreadSubjectTypeSchema: z.ZodType<PullRequestReviewThreadSubjectType> = z.nativeEnum(PullRequestReviewThreadSubjectType);

export const PullRequestStateSchema: z.ZodType<PullRequestState> = z.nativeEnum(PullRequestState);

export const PullRequestTimelineItemsItemTypeSchema: z.ZodType<PullRequestTimelineItemsItemType> = z.nativeEnum(PullRequestTimelineItemsItemType);

export const PullRequestUpdateStateSchema: z.ZodType<PullRequestUpdateState> = z.nativeEnum(PullRequestUpdateState);

export const ReactionContentSchema: z.ZodType<ReactionContent> = z.nativeEnum(ReactionContent);

export const ReactionOrderFieldSchema: z.ZodType<ReactionOrderField> = z.nativeEnum(ReactionOrderField);

export const RefOrderFieldSchema: z.ZodType<RefOrderField> = z.nativeEnum(RefOrderField);

export const ReleaseOrderFieldSchema: z.ZodType<ReleaseOrderField> = z.nativeEnum(ReleaseOrderField);

export const RepoAccessAuditEntryVisibilitySchema: z.ZodType<RepoAccessAuditEntryVisibility> = z.nativeEnum(RepoAccessAuditEntryVisibility);

export const RepoAddMemberAuditEntryVisibilitySchema: z.ZodType<RepoAddMemberAuditEntryVisibility> = z.nativeEnum(RepoAddMemberAuditEntryVisibility);

export const RepoArchivedAuditEntryVisibilitySchema: z.ZodType<RepoArchivedAuditEntryVisibility> = z.nativeEnum(RepoArchivedAuditEntryVisibility);

export const RepoChangeMergeSettingAuditEntryMergeTypeSchema: z.ZodType<RepoChangeMergeSettingAuditEntryMergeType> = z.nativeEnum(RepoChangeMergeSettingAuditEntryMergeType);

export const RepoCreateAuditEntryVisibilitySchema: z.ZodType<RepoCreateAuditEntryVisibility> = z.nativeEnum(RepoCreateAuditEntryVisibility);

export const RepoDestroyAuditEntryVisibilitySchema: z.ZodType<RepoDestroyAuditEntryVisibility> = z.nativeEnum(RepoDestroyAuditEntryVisibility);

export const RepoRemoveMemberAuditEntryVisibilitySchema: z.ZodType<RepoRemoveMemberAuditEntryVisibility> = z.nativeEnum(RepoRemoveMemberAuditEntryVisibility);

export const ReportedContentClassifiersSchema: z.ZodType<ReportedContentClassifiers> = z.nativeEnum(ReportedContentClassifiers);

export const RepositoryAffiliationSchema: z.ZodType<RepositoryAffiliation> = z.nativeEnum(RepositoryAffiliation);

export const RepositoryContributionTypeSchema: z.ZodType<RepositoryContributionType> = z.nativeEnum(RepositoryContributionType);

export const RepositoryInteractionLimitSchema: z.ZodType<RepositoryInteractionLimit> = z.nativeEnum(RepositoryInteractionLimit);

export const RepositoryInteractionLimitExpirySchema: z.ZodType<RepositoryInteractionLimitExpiry> = z.nativeEnum(RepositoryInteractionLimitExpiry);

export const RepositoryInteractionLimitOriginSchema: z.ZodType<RepositoryInteractionLimitOrigin> = z.nativeEnum(RepositoryInteractionLimitOrigin);

export const RepositoryInvitationOrderFieldSchema: z.ZodType<RepositoryInvitationOrderField> = z.nativeEnum(RepositoryInvitationOrderField);

export const RepositoryLockReasonSchema: z.ZodType<RepositoryLockReason> = z.nativeEnum(RepositoryLockReason);

export const RepositoryMigrationOrderDirectionSchema: z.ZodType<RepositoryMigrationOrderDirection> = z.nativeEnum(RepositoryMigrationOrderDirection);

export const RepositoryMigrationOrderFieldSchema: z.ZodType<RepositoryMigrationOrderField> = z.nativeEnum(RepositoryMigrationOrderField);

export const RepositoryOrderFieldSchema: z.ZodType<RepositoryOrderField> = z.nativeEnum(RepositoryOrderField);

export const RepositoryPermissionSchema: z.ZodType<RepositoryPermission> = z.nativeEnum(RepositoryPermission);

export const RepositoryPrivacySchema: z.ZodType<RepositoryPrivacy> = z.nativeEnum(RepositoryPrivacy);

export const RepositoryRuleOrderFieldSchema: z.ZodType<RepositoryRuleOrderField> = z.nativeEnum(RepositoryRuleOrderField);

export const RepositoryRuleTypeSchema: z.ZodType<RepositoryRuleType> = z.nativeEnum(RepositoryRuleType);

export const RepositoryRulesetBypassActorBypassModeSchema: z.ZodType<RepositoryRulesetBypassActorBypassMode> = z.nativeEnum(RepositoryRulesetBypassActorBypassMode);

export const RepositoryRulesetTargetSchema: z.ZodType<RepositoryRulesetTarget> = z.nativeEnum(RepositoryRulesetTarget);

export const RepositoryVisibilitySchema: z.ZodType<RepositoryVisibility> = z.nativeEnum(RepositoryVisibility);

export const RepositoryVulnerabilityAlertDependencyScopeSchema: z.ZodType<RepositoryVulnerabilityAlertDependencyScope> = z.nativeEnum(RepositoryVulnerabilityAlertDependencyScope);

export const RepositoryVulnerabilityAlertStateSchema: z.ZodType<RepositoryVulnerabilityAlertState> = z.nativeEnum(RepositoryVulnerabilityAlertState);

export const RequestableCheckStatusStateSchema: z.ZodType<RequestableCheckStatusState> = z.nativeEnum(RequestableCheckStatusState);

export const RoleInOrganizationSchema: z.ZodType<RoleInOrganization> = z.nativeEnum(RoleInOrganization);

export const RuleEnforcementSchema: z.ZodType<RuleEnforcement> = z.nativeEnum(RuleEnforcement);

export const SamlDigestAlgorithmSchema: z.ZodType<SamlDigestAlgorithm> = z.nativeEnum(SamlDigestAlgorithm);

export const SamlSignatureAlgorithmSchema: z.ZodType<SamlSignatureAlgorithm> = z.nativeEnum(SamlSignatureAlgorithm);

export const SavedReplyOrderFieldSchema: z.ZodType<SavedReplyOrderField> = z.nativeEnum(SavedReplyOrderField);

export const SearchTypeSchema: z.ZodType<SearchType> = z.nativeEnum(SearchType);

export const SecurityAdvisoryClassificationSchema: z.ZodType<SecurityAdvisoryClassification> = z.nativeEnum(SecurityAdvisoryClassification);

export const SecurityAdvisoryEcosystemSchema: z.ZodType<SecurityAdvisoryEcosystem> = z.nativeEnum(SecurityAdvisoryEcosystem);

export const SecurityAdvisoryIdentifierTypeSchema: z.ZodType<SecurityAdvisoryIdentifierType> = z.nativeEnum(SecurityAdvisoryIdentifierType);

export const SecurityAdvisoryOrderFieldSchema: z.ZodType<SecurityAdvisoryOrderField> = z.nativeEnum(SecurityAdvisoryOrderField);

export const SecurityAdvisorySeveritySchema: z.ZodType<SecurityAdvisorySeverity> = z.nativeEnum(SecurityAdvisorySeverity);

export const SecurityVulnerabilityOrderFieldSchema: z.ZodType<SecurityVulnerabilityOrderField> = z.nativeEnum(SecurityVulnerabilityOrderField);

export const SocialAccountProviderSchema: z.ZodType<SocialAccountProvider> = z.nativeEnum(SocialAccountProvider);

export const SponsorAndLifetimeValueOrderFieldSchema: z.ZodType<SponsorAndLifetimeValueOrderField> = z.nativeEnum(SponsorAndLifetimeValueOrderField);

export const SponsorOrderFieldSchema: z.ZodType<SponsorOrderField> = z.nativeEnum(SponsorOrderField);

export const SponsorableOrderFieldSchema: z.ZodType<SponsorableOrderField> = z.nativeEnum(SponsorableOrderField);

export const SponsorsActivityActionSchema: z.ZodType<SponsorsActivityAction> = z.nativeEnum(SponsorsActivityAction);

export const SponsorsActivityOrderFieldSchema: z.ZodType<SponsorsActivityOrderField> = z.nativeEnum(SponsorsActivityOrderField);

export const SponsorsActivityPeriodSchema: z.ZodType<SponsorsActivityPeriod> = z.nativeEnum(SponsorsActivityPeriod);

export const SponsorsCountryOrRegionCodeSchema: z.ZodType<SponsorsCountryOrRegionCode> = z.nativeEnum(SponsorsCountryOrRegionCode);

export const SponsorsGoalKindSchema: z.ZodType<SponsorsGoalKind> = z.nativeEnum(SponsorsGoalKind);

export const SponsorsListingFeaturedItemFeatureableTypeSchema: z.ZodType<SponsorsListingFeaturedItemFeatureableType> = z.nativeEnum(SponsorsListingFeaturedItemFeatureableType);

export const SponsorsTierOrderFieldSchema: z.ZodType<SponsorsTierOrderField> = z.nativeEnum(SponsorsTierOrderField);

export const SponsorshipNewsletterOrderFieldSchema: z.ZodType<SponsorshipNewsletterOrderField> = z.nativeEnum(SponsorshipNewsletterOrderField);

export const SponsorshipOrderFieldSchema: z.ZodType<SponsorshipOrderField> = z.nativeEnum(SponsorshipOrderField);

export const SponsorshipPaymentSourceSchema: z.ZodType<SponsorshipPaymentSource> = z.nativeEnum(SponsorshipPaymentSource);

export const SponsorshipPrivacySchema: z.ZodType<SponsorshipPrivacy> = z.nativeEnum(SponsorshipPrivacy);

export const SquashMergeCommitMessageSchema: z.ZodType<SquashMergeCommitMessage> = z.nativeEnum(SquashMergeCommitMessage);

export const SquashMergeCommitTitleSchema: z.ZodType<SquashMergeCommitTitle> = z.nativeEnum(SquashMergeCommitTitle);

export const StarOrderFieldSchema: z.ZodType<StarOrderField> = z.nativeEnum(StarOrderField);

export const StatusStateSchema: z.ZodType<StatusState> = z.nativeEnum(StatusState);

export const SubscriptionStateSchema: z.ZodType<SubscriptionState> = z.nativeEnum(SubscriptionState);

export const TeamDiscussionCommentOrderFieldSchema: z.ZodType<TeamDiscussionCommentOrderField> = z.nativeEnum(TeamDiscussionCommentOrderField);

export const TeamDiscussionOrderFieldSchema: z.ZodType<TeamDiscussionOrderField> = z.nativeEnum(TeamDiscussionOrderField);

export const TeamMemberOrderFieldSchema: z.ZodType<TeamMemberOrderField> = z.nativeEnum(TeamMemberOrderField);

export const TeamMemberRoleSchema: z.ZodType<TeamMemberRole> = z.nativeEnum(TeamMemberRole);

export const TeamMembershipTypeSchema: z.ZodType<TeamMembershipType> = z.nativeEnum(TeamMembershipType);

export const TeamNotificationSettingSchema: z.ZodType<TeamNotificationSetting> = z.nativeEnum(TeamNotificationSetting);

export const TeamOrderFieldSchema: z.ZodType<TeamOrderField> = z.nativeEnum(TeamOrderField);

export const TeamPrivacySchema: z.ZodType<TeamPrivacy> = z.nativeEnum(TeamPrivacy);

export const TeamRepositoryOrderFieldSchema: z.ZodType<TeamRepositoryOrderField> = z.nativeEnum(TeamRepositoryOrderField);

export const TeamReviewAssignmentAlgorithmSchema: z.ZodType<TeamReviewAssignmentAlgorithm> = z.nativeEnum(TeamReviewAssignmentAlgorithm);

export const TeamRoleSchema: z.ZodType<TeamRole> = z.nativeEnum(TeamRole);

export const ThreadSubscriptionFormActionSchema: z.ZodType<ThreadSubscriptionFormAction> = z.nativeEnum(ThreadSubscriptionFormAction);

export const ThreadSubscriptionStateSchema: z.ZodType<ThreadSubscriptionState> = z.nativeEnum(ThreadSubscriptionState);

export const TopicSuggestionDeclineReasonSchema: z.ZodType<TopicSuggestionDeclineReason> = z.nativeEnum(TopicSuggestionDeclineReason);

export const TrackedIssueStatesSchema: z.ZodType<TrackedIssueStates> = z.nativeEnum(TrackedIssueStates);

export const TwoFactorCredentialSecurityTypeSchema: z.ZodType<TwoFactorCredentialSecurityType> = z.nativeEnum(TwoFactorCredentialSecurityType);

export const UserBlockDurationSchema: z.ZodType<UserBlockDuration> = z.nativeEnum(UserBlockDuration);

export const UserStatusOrderFieldSchema: z.ZodType<UserStatusOrderField> = z.nativeEnum(UserStatusOrderField);

export const UserViewTypeSchema: z.ZodType<UserViewType> = z.nativeEnum(UserViewType);

export const VerifiableDomainOrderFieldSchema: z.ZodType<VerifiableDomainOrderField> = z.nativeEnum(VerifiableDomainOrderField);

export const WorkflowRunOrderFieldSchema: z.ZodType<WorkflowRunOrderField> = z.nativeEnum(WorkflowRunOrderField);

export const WorkflowStateSchema: z.ZodType<WorkflowState> = z.nativeEnum(WorkflowState);

export function AbortQueuedMigrationsInputSchema(): z.ZodObject<Properties<AbortQueuedMigrationsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string()
  })
}

export function AbortRepositoryMigrationInputSchema(): z.ZodObject<Properties<AbortRepositoryMigrationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    migrationId: z.string()
  })
}

export function AcceptEnterpriseAdministratorInvitationInputSchema(): z.ZodObject<Properties<AcceptEnterpriseAdministratorInvitationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    invitationId: z.string()
  })
}

export function AcceptEnterpriseMemberInvitationInputSchema(): z.ZodObject<Properties<AcceptEnterpriseMemberInvitationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    invitationId: z.string()
  })
}

export function AcceptTopicSuggestionInputSchema(): z.ZodObject<Properties<AcceptTopicSuggestionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string().nullish(),
    repositoryId: z.string().nullish()
  })
}

export function AccessUserNamespaceRepositoryInputSchema(): z.ZodObject<Properties<AccessUserNamespaceRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    repositoryId: z.string()
  })
}

export function AddAssigneesToAssignableInputSchema(): z.ZodObject<Properties<AddAssigneesToAssignableInput>> {
  return z.object({
    assignableId: z.string(),
    assigneeIds: z.array(z.string()),
    clientMutationId: z.string().nullish()
  })
}

export function AddCommentInputSchema(): z.ZodObject<Properties<AddCommentInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    subjectId: z.string()
  })
}

export function AddDiscussionCommentInputSchema(): z.ZodObject<Properties<AddDiscussionCommentInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    discussionId: z.string(),
    replyToId: z.string().nullish()
  })
}

export function AddDiscussionPollVoteInputSchema(): z.ZodObject<Properties<AddDiscussionPollVoteInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pollOptionId: z.string()
  })
}

export function AddEnterpriseOrganizationMemberInputSchema(): z.ZodObject<Properties<AddEnterpriseOrganizationMemberInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    organizationId: z.string(),
    role: OrganizationMemberRoleSchema.nullish(),
    userIds: z.array(z.string())
  })
}

export function AddEnterpriseSupportEntitlementInputSchema(): z.ZodObject<Properties<AddEnterpriseSupportEntitlementInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string()
  })
}

export function AddLabelsToLabelableInputSchema(): z.ZodObject<Properties<AddLabelsToLabelableInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    labelIds: z.array(z.string()),
    labelableId: z.string()
  })
}

export function AddProjectCardInputSchema(): z.ZodObject<Properties<AddProjectCardInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    contentId: z.string().nullish(),
    note: z.string().nullish(),
    projectColumnId: z.string()
  })
}

export function AddProjectColumnInputSchema(): z.ZodObject<Properties<AddProjectColumnInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string(),
    projectId: z.string()
  })
}

export function AddProjectV2DraftIssueInputSchema(): z.ZodObject<Properties<AddProjectV2DraftIssueInput>> {
  return z.object({
    assigneeIds: z.array(z.string()).nullish(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    title: z.string()
  })
}

export function AddProjectV2ItemByIdInputSchema(): z.ZodObject<Properties<AddProjectV2ItemByIdInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    contentId: z.string(),
    projectId: z.string()
  })
}

export function AddPullRequestReviewCommentInputSchema(): z.ZodObject<Properties<AddPullRequestReviewCommentInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    commitOID: z.string().nullish(),
    inReplyTo: z.string().nullish(),
    path: z.string().nullish(),
    position: z.number().nullish(),
    pullRequestId: z.string().nullish(),
    pullRequestReviewId: z.string().nullish()
  })
}

export function AddPullRequestReviewInputSchema(): z.ZodObject<Properties<AddPullRequestReviewInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    comments: z.array(z.lazy(() => DraftPullRequestReviewCommentSchema().nullable())).nullish(),
    commitOID: z.string().nullish(),
    event: PullRequestReviewEventSchema.nullish(),
    pullRequestId: z.string(),
    threads: z.array(z.lazy(() => DraftPullRequestReviewThreadSchema().nullable())).nullish()
  })
}

export function AddPullRequestReviewThreadInputSchema(): z.ZodObject<Properties<AddPullRequestReviewThreadInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    line: z.number().nullish(),
    path: z.string(),
    pullRequestId: z.string().nullish(),
    pullRequestReviewId: z.string().nullish(),
    side: DiffSideSchema.default(DiffSide.Right).nullish(),
    startLine: z.number().nullish(),
    startSide: DiffSideSchema.default(DiffSide.Right).nullish(),
    subjectType: PullRequestReviewThreadSubjectTypeSchema.default(PullRequestReviewThreadSubjectType.Line).nullish()
  })
}

export function AddPullRequestReviewThreadReplyInputSchema(): z.ZodObject<Properties<AddPullRequestReviewThreadReplyInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    pullRequestReviewId: z.string().nullish(),
    pullRequestReviewThreadId: z.string()
  })
}

export function AddReactionInputSchema(): z.ZodObject<Properties<AddReactionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    content: ReactionContentSchema,
    subjectId: z.string()
  })
}

export function AddStarInputSchema(): z.ZodObject<Properties<AddStarInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    starrableId: z.string()
  })
}

export function AddSubIssueInputSchema(): z.ZodObject<Properties<AddSubIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string(),
    replaceParent: z.boolean().nullish(),
    subIssueId: z.string().nullish(),
    subIssueUrl: z.string().nullish()
  })
}

export function AddUpvoteInputSchema(): z.ZodObject<Properties<AddUpvoteInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    subjectId: z.string()
  })
}

export function AddVerifiableDomainInputSchema(): z.ZodObject<Properties<AddVerifiableDomainInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    domain: z.string(),
    ownerId: z.string()
  })
}

export function ApproveDeploymentsInputSchema(): z.ZodObject<Properties<ApproveDeploymentsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    comment: z.string().default("").nullish(),
    environmentIds: z.array(z.string()),
    workflowRunId: z.string()
  })
}

export function ApproveVerifiableDomainInputSchema(): z.ZodObject<Properties<ApproveVerifiableDomainInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function ArchiveProjectV2ItemInputSchema(): z.ZodObject<Properties<ArchiveProjectV2ItemInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    projectId: z.string()
  })
}

export function ArchiveRepositoryInputSchema(): z.ZodObject<Properties<ArchiveRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    repositoryId: z.string()
  })
}

export function AuditLogOrderSchema(): z.ZodObject<Properties<AuditLogOrder>> {
  return z.object({
    direction: OrderDirectionSchema.nullish(),
    field: AuditLogOrderFieldSchema.nullish()
  })
}

export function BranchNamePatternParametersInputSchema(): z.ZodObject<Properties<BranchNamePatternParametersInput>> {
  return z.object({
    name: z.string().nullish(),
    negate: z.boolean().nullish(),
    operator: z.string(),
    pattern: z.string()
  })
}

export function BulkSponsorshipSchema(): z.ZodObject<Properties<BulkSponsorship>> {
  return z.object({
    amount: z.number(),
    sponsorableId: z.string().nullish(),
    sponsorableLogin: z.string().nullish()
  })
}

export function CancelEnterpriseAdminInvitationInputSchema(): z.ZodObject<Properties<CancelEnterpriseAdminInvitationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    invitationId: z.string()
  })
}

export function CancelEnterpriseMemberInvitationInputSchema(): z.ZodObject<Properties<CancelEnterpriseMemberInvitationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    invitationId: z.string()
  })
}

export function CancelSponsorshipInputSchema(): z.ZodObject<Properties<CancelSponsorshipInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    sponsorId: z.string().nullish(),
    sponsorLogin: z.string().nullish(),
    sponsorableId: z.string().nullish(),
    sponsorableLogin: z.string().nullish()
  })
}

export function ChangeUserStatusInputSchema(): z.ZodObject<Properties<ChangeUserStatusInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    emoji: z.string().nullish(),
    expiresAt: z.string().nullish(),
    limitedAvailability: z.boolean().default(false).nullish(),
    message: z.string().nullish(),
    organizationId: z.string().nullish()
  })
}

export function CheckAnnotationDataSchema(): z.ZodObject<Properties<CheckAnnotationData>> {
  return z.object({
    annotationLevel: CheckAnnotationLevelSchema,
    location: z.lazy(() => CheckAnnotationRangeSchema()),
    message: z.string(),
    path: z.string(),
    rawDetails: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function CheckAnnotationRangeSchema(): z.ZodObject<Properties<CheckAnnotationRange>> {
  return z.object({
    endColumn: z.number().nullish(),
    endLine: z.number(),
    startColumn: z.number().nullish(),
    startLine: z.number()
  })
}

export function CheckRunActionSchema(): z.ZodObject<Properties<CheckRunAction>> {
  return z.object({
    description: z.string(),
    identifier: z.string(),
    label: z.string()
  })
}

export function CheckRunFilterSchema(): z.ZodObject<Properties<CheckRunFilter>> {
  return z.object({
    appId: z.number().nullish(),
    checkName: z.string().nullish(),
    checkType: CheckRunTypeSchema.nullish(),
    conclusions: z.array(CheckConclusionStateSchema).nullish(),
    status: CheckStatusStateSchema.nullish(),
    statuses: z.array(CheckStatusStateSchema).nullish()
  })
}

export function CheckRunOutputSchema(): z.ZodObject<Properties<CheckRunOutput>> {
  return z.object({
    annotations: z.array(z.lazy(() => CheckAnnotationDataSchema())).nullish(),
    images: z.array(z.lazy(() => CheckRunOutputImageSchema())).nullish(),
    summary: z.string(),
    text: z.string().nullish(),
    title: z.string()
  })
}

export function CheckRunOutputImageSchema(): z.ZodObject<Properties<CheckRunOutputImage>> {
  return z.object({
    alt: z.string(),
    caption: z.string().nullish(),
    imageUrl: z.string()
  })
}

export function CheckSuiteAutoTriggerPreferenceSchema(): z.ZodObject<Properties<CheckSuiteAutoTriggerPreference>> {
  return z.object({
    appId: z.string(),
    setting: z.boolean()
  })
}

export function CheckSuiteFilterSchema(): z.ZodObject<Properties<CheckSuiteFilter>> {
  return z.object({
    appId: z.number().nullish(),
    checkName: z.string().nullish()
  })
}

export function ClearLabelsFromLabelableInputSchema(): z.ZodObject<Properties<ClearLabelsFromLabelableInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    labelableId: z.string()
  })
}

export function ClearProjectV2ItemFieldValueInputSchema(): z.ZodObject<Properties<ClearProjectV2ItemFieldValueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    fieldId: z.string(),
    itemId: z.string(),
    projectId: z.string()
  })
}

export function CloneProjectInputSchema(): z.ZodObject<Properties<CloneProjectInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    includeWorkflows: z.boolean(),
    name: z.string(),
    public: z.boolean().nullish(),
    sourceId: z.string(),
    targetOwnerId: z.string()
  })
}

export function CloneTemplateRepositoryInputSchema(): z.ZodObject<Properties<CloneTemplateRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    includeAllBranches: z.boolean().default(false).nullish(),
    name: z.string(),
    ownerId: z.string(),
    repositoryId: z.string(),
    visibility: RepositoryVisibilitySchema
  })
}

export function CloseDiscussionInputSchema(): z.ZodObject<Properties<CloseDiscussionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    discussionId: z.string(),
    reason: DiscussionCloseReasonSchema.default(DiscussionCloseReason.Resolved).nullish()
  })
}

export function CloseIssueInputSchema(): z.ZodObject<Properties<CloseIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    duplicateIssueId: z.string().nullish(),
    issueId: z.string(),
    stateReason: IssueClosedStateReasonSchema.nullish()
  })
}

export function ClosePullRequestInputSchema(): z.ZodObject<Properties<ClosePullRequestInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string()
  })
}

export function CodeScanningParametersInputSchema(): z.ZodObject<Properties<CodeScanningParametersInput>> {
  return z.object({
    codeScanningTools: z.array(z.lazy(() => CodeScanningToolInputSchema()))
  })
}

export function CodeScanningToolInputSchema(): z.ZodObject<Properties<CodeScanningToolInput>> {
  return z.object({
    alertsThreshold: z.string(),
    securityAlertsThreshold: z.string(),
    tool: z.string()
  })
}

export function CommitAuthorSchema(): z.ZodObject<Properties<CommitAuthor>> {
  return z.object({
    emails: z.array(z.string()).nullish(),
    id: z.string().nullish()
  })
}

export function CommitAuthorEmailPatternParametersInputSchema(): z.ZodObject<Properties<CommitAuthorEmailPatternParametersInput>> {
  return z.object({
    name: z.string().nullish(),
    negate: z.boolean().nullish(),
    operator: z.string(),
    pattern: z.string()
  })
}

export function CommitContributionOrderSchema(): z.ZodObject<Properties<CommitContributionOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: CommitContributionOrderFieldSchema
  })
}

export function CommitMessageSchema(): z.ZodObject<Properties<CommitMessage>> {
  return z.object({
    body: z.string().nullish(),
    headline: z.string()
  })
}

export function CommitMessagePatternParametersInputSchema(): z.ZodObject<Properties<CommitMessagePatternParametersInput>> {
  return z.object({
    name: z.string().nullish(),
    negate: z.boolean().nullish(),
    operator: z.string(),
    pattern: z.string()
  })
}

export function CommittableBranchSchema(): z.ZodObject<Properties<CommittableBranch>> {
  return z.object({
    branchName: z.string().nullish(),
    id: z.string().nullish(),
    repositoryNameWithOwner: z.string().nullish()
  })
}

export function CommitterEmailPatternParametersInputSchema(): z.ZodObject<Properties<CommitterEmailPatternParametersInput>> {
  return z.object({
    name: z.string().nullish(),
    negate: z.boolean().nullish(),
    operator: z.string(),
    pattern: z.string()
  })
}

export function ContributionOrderSchema(): z.ZodObject<Properties<ContributionOrder>> {
  return z.object({
    direction: OrderDirectionSchema
  })
}

export function ConvertProjectCardNoteToIssueInputSchema(): z.ZodObject<Properties<ConvertProjectCardNoteToIssueInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    projectCardId: z.string(),
    repositoryId: z.string(),
    title: z.string().nullish()
  })
}

export function ConvertProjectV2DraftIssueItemToIssueInputSchema(): z.ZodObject<Properties<ConvertProjectV2DraftIssueItemToIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    repositoryId: z.string()
  })
}

export function ConvertPullRequestToDraftInputSchema(): z.ZodObject<Properties<ConvertPullRequestToDraftInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string()
  })
}

export function CopyProjectV2InputSchema(): z.ZodObject<Properties<CopyProjectV2Input>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    includeDraftIssues: z.boolean().default(false).nullish(),
    ownerId: z.string(),
    projectId: z.string(),
    title: z.string()
  })
}

export function CreateAttributionInvitationInputSchema(): z.ZodObject<Properties<CreateAttributionInvitationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string(),
    sourceId: z.string(),
    targetId: z.string()
  })
}

export function CreateBranchProtectionRuleInputSchema(): z.ZodObject<Properties<CreateBranchProtectionRuleInput>> {
  return z.object({
    allowsDeletions: z.boolean().nullish(),
    allowsForcePushes: z.boolean().nullish(),
    blocksCreations: z.boolean().nullish(),
    bypassForcePushActorIds: z.array(z.string()).nullish(),
    bypassPullRequestActorIds: z.array(z.string()).nullish(),
    clientMutationId: z.string().nullish(),
    dismissesStaleReviews: z.boolean().nullish(),
    isAdminEnforced: z.boolean().nullish(),
    lockAllowsFetchAndMerge: z.boolean().nullish(),
    lockBranch: z.boolean().nullish(),
    pattern: z.string(),
    pushActorIds: z.array(z.string()).nullish(),
    repositoryId: z.string(),
    requireLastPushApproval: z.boolean().nullish(),
    requiredApprovingReviewCount: z.number().nullish(),
    requiredDeploymentEnvironments: z.array(z.string()).nullish(),
    requiredStatusCheckContexts: z.array(z.string()).nullish(),
    requiredStatusChecks: z.array(z.lazy(() => RequiredStatusCheckInputSchema())).nullish(),
    requiresApprovingReviews: z.boolean().nullish(),
    requiresCodeOwnerReviews: z.boolean().nullish(),
    requiresCommitSignatures: z.boolean().nullish(),
    requiresConversationResolution: z.boolean().nullish(),
    requiresDeployments: z.boolean().nullish(),
    requiresLinearHistory: z.boolean().nullish(),
    requiresStatusChecks: z.boolean().nullish(),
    requiresStrictStatusChecks: z.boolean().nullish(),
    restrictsPushes: z.boolean().nullish(),
    restrictsReviewDismissals: z.boolean().nullish(),
    reviewDismissalActorIds: z.array(z.string()).nullish()
  })
}

export function CreateCheckRunInputSchema(): z.ZodObject<Properties<CreateCheckRunInput>> {
  return z.object({
    actions: z.array(z.lazy(() => CheckRunActionSchema())).nullish(),
    clientMutationId: z.string().nullish(),
    completedAt: z.string().nullish(),
    conclusion: CheckConclusionStateSchema.nullish(),
    detailsUrl: z.string().nullish(),
    externalId: z.string().nullish(),
    headSha: z.string(),
    name: z.string(),
    output: z.lazy(() => CheckRunOutputSchema().nullish()),
    repositoryId: z.string(),
    startedAt: z.string().nullish(),
    status: RequestableCheckStatusStateSchema.nullish()
  })
}

export function CreateCheckSuiteInputSchema(): z.ZodObject<Properties<CreateCheckSuiteInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    headSha: z.string(),
    repositoryId: z.string()
  })
}

export function CreateCommitOnBranchInputSchema(): z.ZodObject<Properties<CreateCommitOnBranchInput>> {
  return z.object({
    branch: z.lazy(() => CommittableBranchSchema()),
    clientMutationId: z.string().nullish(),
    expectedHeadOid: z.string(),
    fileChanges: z.lazy(() => FileChangesSchema().nullish()),
    message: z.lazy(() => CommitMessageSchema())
  })
}

export function CreateDeploymentInputSchema(): z.ZodObject<Properties<CreateDeploymentInput>> {
  return z.object({
    autoMerge: z.boolean().default(true).nullish(),
    clientMutationId: z.string().nullish(),
    description: z.string().default("").nullish(),
    environment: z.string().default("production").nullish(),
    payload: z.string().default("{}").nullish(),
    refId: z.string(),
    repositoryId: z.string(),
    requiredContexts: z.array(z.string()).nullish(),
    task: z.string().default("deploy").nullish()
  })
}

export function CreateDeploymentStatusInputSchema(): z.ZodObject<Properties<CreateDeploymentStatusInput>> {
  return z.object({
    autoInactive: z.boolean().default(true).nullish(),
    clientMutationId: z.string().nullish(),
    deploymentId: z.string(),
    description: z.string().default("").nullish(),
    environment: z.string().nullish(),
    environmentUrl: z.string().default("").nullish(),
    logUrl: z.string().default("").nullish(),
    state: DeploymentStatusStateSchema
  })
}

export function CreateDiscussionInputSchema(): z.ZodObject<Properties<CreateDiscussionInput>> {
  return z.object({
    body: z.string(),
    categoryId: z.string(),
    clientMutationId: z.string().nullish(),
    repositoryId: z.string(),
    title: z.string()
  })
}

export function CreateEnterpriseOrganizationInputSchema(): z.ZodObject<Properties<CreateEnterpriseOrganizationInput>> {
  return z.object({
    adminLogins: z.array(z.string()),
    billingEmail: z.string(),
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string(),
    profileName: z.string()
  })
}

export function CreateEnvironmentInputSchema(): z.ZodObject<Properties<CreateEnvironmentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string(),
    repositoryId: z.string()
  })
}

export function CreateIpAllowListEntryInputSchema(): z.ZodObject<Properties<CreateIpAllowListEntryInput>> {
  return z.object({
    allowListValue: z.string(),
    clientMutationId: z.string().nullish(),
    isActive: z.boolean(),
    name: z.string().nullish(),
    ownerId: z.string()
  })
}

export function CreateIssueInputSchema(): z.ZodObject<Properties<CreateIssueInput>> {
  return z.object({
    assigneeIds: z.array(z.string()).nullish(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    issueTemplate: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    milestoneId: z.string().nullish(),
    parentIssueId: z.string().nullish(),
    projectIds: z.array(z.string()).nullish(),
    repositoryId: z.string(),
    title: z.string()
  })
}

export function CreateLabelInputSchema(): z.ZodObject<Properties<CreateLabelInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    color: z.string(),
    description: z.string().nullish(),
    name: z.string(),
    repositoryId: z.string()
  })
}

export function CreateLinkedBranchInputSchema(): z.ZodObject<Properties<CreateLinkedBranchInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string(),
    name: z.string().nullish(),
    oid: z.string(),
    repositoryId: z.string().nullish()
  })
}

export function CreateMigrationSourceInputSchema(): z.ZodObject<Properties<CreateMigrationSourceInput>> {
  return z.object({
    accessToken: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    githubPat: z.string().nullish(),
    name: z.string(),
    ownerId: z.string(),
    type: MigrationSourceTypeSchema,
    url: z.string().nullish()
  })
}

export function CreateProjectInputSchema(): z.ZodObject<Properties<CreateProjectInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    name: z.string(),
    ownerId: z.string(),
    repositoryIds: z.array(z.string()).nullish(),
    template: ProjectTemplateSchema.nullish()
  })
}

export function CreateProjectV2FieldInputSchema(): z.ZodObject<Properties<CreateProjectV2FieldInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    dataType: ProjectV2CustomFieldTypeSchema,
    iterationConfiguration: z.lazy(() => ProjectV2IterationFieldConfigurationInputSchema().nullish()),
    name: z.string(),
    projectId: z.string(),
    singleSelectOptions: z.array(z.lazy(() => ProjectV2SingleSelectFieldOptionInputSchema())).nullish()
  })
}

export function CreateProjectV2InputSchema(): z.ZodObject<Properties<CreateProjectV2Input>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string(),
    repositoryId: z.string().nullish(),
    teamId: z.string().nullish(),
    title: z.string()
  })
}

export function CreateProjectV2StatusUpdateInputSchema(): z.ZodObject<Properties<CreateProjectV2StatusUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    startDate: z.string().nullish(),
    status: ProjectV2StatusUpdateStatusSchema.nullish(),
    targetDate: z.string().nullish()
  })
}

export function CreatePullRequestInputSchema(): z.ZodObject<Properties<CreatePullRequestInput>> {
  return z.object({
    baseRefName: z.string(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    draft: z.boolean().default(false).nullish(),
    headRefName: z.string(),
    headRepositoryId: z.string().nullish(),
    maintainerCanModify: z.boolean().default(true).nullish(),
    repositoryId: z.string(),
    title: z.string()
  })
}

export function CreateRefInputSchema(): z.ZodObject<Properties<CreateRefInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string(),
    oid: z.string(),
    repositoryId: z.string()
  })
}

export function CreateRepositoryInputSchema(): z.ZodObject<Properties<CreateRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    hasIssuesEnabled: z.boolean().default(true).nullish(),
    hasWikiEnabled: z.boolean().default(false).nullish(),
    homepageUrl: z.string().nullish(),
    name: z.string(),
    ownerId: z.string().nullish(),
    teamId: z.string().nullish(),
    template: z.boolean().default(false).nullish(),
    visibility: RepositoryVisibilitySchema
  })
}

export function CreateRepositoryRulesetInputSchema(): z.ZodObject<Properties<CreateRepositoryRulesetInput>> {
  return z.object({
    bypassActors: z.array(z.lazy(() => RepositoryRulesetBypassActorInputSchema())).nullish(),
    clientMutationId: z.string().nullish(),
    conditions: z.lazy(() => RepositoryRuleConditionsInputSchema()),
    enforcement: RuleEnforcementSchema,
    name: z.string(),
    rules: z.array(z.lazy(() => RepositoryRuleInputSchema())).nullish(),
    sourceId: z.string(),
    target: RepositoryRulesetTargetSchema.nullish()
  })
}

export function CreateSponsorsListingInputSchema(): z.ZodObject<Properties<CreateSponsorsListingInput>> {
  return z.object({
    billingCountryOrRegionCode: SponsorsCountryOrRegionCodeSchema.nullish(),
    clientMutationId: z.string().nullish(),
    contactEmail: z.string().nullish(),
    fiscalHostLogin: z.string().nullish(),
    fiscallyHostedProjectProfileUrl: z.string().nullish(),
    fullDescription: z.string().nullish(),
    residenceCountryOrRegionCode: SponsorsCountryOrRegionCodeSchema.nullish(),
    sponsorableLogin: z.string().nullish()
  })
}

export function CreateSponsorsTierInputSchema(): z.ZodObject<Properties<CreateSponsorsTierInput>> {
  return z.object({
    amount: z.number(),
    clientMutationId: z.string().nullish(),
    description: z.string(),
    isRecurring: z.boolean().default(true).nullish(),
    publish: z.boolean().default(false).nullish(),
    repositoryId: z.string().nullish(),
    repositoryName: z.string().nullish(),
    repositoryOwnerLogin: z.string().nullish(),
    sponsorableId: z.string().nullish(),
    sponsorableLogin: z.string().nullish(),
    welcomeMessage: z.string().nullish()
  })
}

export function CreateSponsorshipInputSchema(): z.ZodObject<Properties<CreateSponsorshipInput>> {
  return z.object({
    amount: z.number().nullish(),
    clientMutationId: z.string().nullish(),
    isRecurring: z.boolean().nullish(),
    privacyLevel: SponsorshipPrivacySchema.default(SponsorshipPrivacy.Public).nullish(),
    receiveEmails: z.boolean().default(true).nullish(),
    sponsorId: z.string().nullish(),
    sponsorLogin: z.string().nullish(),
    sponsorableId: z.string().nullish(),
    sponsorableLogin: z.string().nullish(),
    tierId: z.string().nullish()
  })
}

export function CreateSponsorshipsInputSchema(): z.ZodObject<Properties<CreateSponsorshipsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    privacyLevel: SponsorshipPrivacySchema.default(SponsorshipPrivacy.Public).nullish(),
    receiveEmails: z.boolean().default(false).nullish(),
    recurring: z.boolean().default(false).nullish(),
    sponsorLogin: z.string(),
    sponsorships: z.array(z.lazy(() => BulkSponsorshipSchema()))
  })
}

export function CreateTeamDiscussionCommentInputSchema(): z.ZodObject<Properties<CreateTeamDiscussionCommentInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    discussionId: z.string().nullish()
  })
}

export function CreateTeamDiscussionInputSchema(): z.ZodObject<Properties<CreateTeamDiscussionInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    private: z.boolean().nullish(),
    teamId: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function CreateUserListInputSchema(): z.ZodObject<Properties<CreateUserListInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    isPrivate: z.boolean().default(false).nullish(),
    name: z.string()
  })
}

export function DeclineTopicSuggestionInputSchema(): z.ZodObject<Properties<DeclineTopicSuggestionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string().nullish(),
    reason: TopicSuggestionDeclineReasonSchema.nullish(),
    repositoryId: z.string().nullish()
  })
}

export function DeleteBranchProtectionRuleInputSchema(): z.ZodObject<Properties<DeleteBranchProtectionRuleInput>> {
  return z.object({
    branchProtectionRuleId: z.string(),
    clientMutationId: z.string().nullish()
  })
}

export function DeleteDeploymentInputSchema(): z.ZodObject<Properties<DeleteDeploymentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteDiscussionCommentInputSchema(): z.ZodObject<Properties<DeleteDiscussionCommentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteDiscussionInputSchema(): z.ZodObject<Properties<DeleteDiscussionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteEnvironmentInputSchema(): z.ZodObject<Properties<DeleteEnvironmentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteIpAllowListEntryInputSchema(): z.ZodObject<Properties<DeleteIpAllowListEntryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ipAllowListEntryId: z.string()
  })
}

export function DeleteIssueCommentInputSchema(): z.ZodObject<Properties<DeleteIssueCommentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteIssueInputSchema(): z.ZodObject<Properties<DeleteIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string()
  })
}

export function DeleteLabelInputSchema(): z.ZodObject<Properties<DeleteLabelInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteLinkedBranchInputSchema(): z.ZodObject<Properties<DeleteLinkedBranchInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    linkedBranchId: z.string()
  })
}

export function DeletePackageVersionInputSchema(): z.ZodObject<Properties<DeletePackageVersionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    packageVersionId: z.string()
  })
}

export function DeleteProjectCardInputSchema(): z.ZodObject<Properties<DeleteProjectCardInput>> {
  return z.object({
    cardId: z.string(),
    clientMutationId: z.string().nullish()
  })
}

export function DeleteProjectColumnInputSchema(): z.ZodObject<Properties<DeleteProjectColumnInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    columnId: z.string()
  })
}

export function DeleteProjectInputSchema(): z.ZodObject<Properties<DeleteProjectInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string()
  })
}

export function DeleteProjectV2FieldInputSchema(): z.ZodObject<Properties<DeleteProjectV2FieldInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    fieldId: z.string()
  })
}

export function DeleteProjectV2InputSchema(): z.ZodObject<Properties<DeleteProjectV2Input>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string()
  })
}

export function DeleteProjectV2ItemInputSchema(): z.ZodObject<Properties<DeleteProjectV2ItemInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    projectId: z.string()
  })
}

export function DeleteProjectV2StatusUpdateInputSchema(): z.ZodObject<Properties<DeleteProjectV2StatusUpdateInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    statusUpdateId: z.string()
  })
}

export function DeleteProjectV2WorkflowInputSchema(): z.ZodObject<Properties<DeleteProjectV2WorkflowInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    workflowId: z.string()
  })
}

export function DeletePullRequestReviewCommentInputSchema(): z.ZodObject<Properties<DeletePullRequestReviewCommentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeletePullRequestReviewInputSchema(): z.ZodObject<Properties<DeletePullRequestReviewInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestReviewId: z.string()
  })
}

export function DeleteRefInputSchema(): z.ZodObject<Properties<DeleteRefInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    refId: z.string()
  })
}

export function DeleteRepositoryRulesetInputSchema(): z.ZodObject<Properties<DeleteRepositoryRulesetInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    repositoryRulesetId: z.string()
  })
}

export function DeleteTeamDiscussionCommentInputSchema(): z.ZodObject<Properties<DeleteTeamDiscussionCommentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteTeamDiscussionInputSchema(): z.ZodObject<Properties<DeleteTeamDiscussionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeleteUserListInputSchema(): z.ZodObject<Properties<DeleteUserListInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    listId: z.string()
  })
}

export function DeleteVerifiableDomainInputSchema(): z.ZodObject<Properties<DeleteVerifiableDomainInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DeploymentOrderSchema(): z.ZodObject<Properties<DeploymentOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: DeploymentOrderFieldSchema
  })
}

export function DequeuePullRequestInputSchema(): z.ZodObject<Properties<DequeuePullRequestInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function DisablePullRequestAutoMergeInputSchema(): z.ZodObject<Properties<DisablePullRequestAutoMergeInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string()
  })
}

export function DiscussionOrderSchema(): z.ZodObject<Properties<DiscussionOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: DiscussionOrderFieldSchema
  })
}

export function DiscussionPollOptionOrderSchema(): z.ZodObject<Properties<DiscussionPollOptionOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: DiscussionPollOptionOrderFieldSchema
  })
}

export function DismissPullRequestReviewInputSchema(): z.ZodObject<Properties<DismissPullRequestReviewInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    message: z.string(),
    pullRequestReviewId: z.string()
  })
}

export function DismissRepositoryVulnerabilityAlertInputSchema(): z.ZodObject<Properties<DismissRepositoryVulnerabilityAlertInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    dismissReason: DismissReasonSchema,
    repositoryVulnerabilityAlertId: z.string()
  })
}

export function DraftPullRequestReviewCommentSchema(): z.ZodObject<Properties<DraftPullRequestReviewComment>> {
  return z.object({
    body: z.string(),
    path: z.string(),
    position: z.number()
  })
}

export function DraftPullRequestReviewThreadSchema(): z.ZodObject<Properties<DraftPullRequestReviewThread>> {
  return z.object({
    body: z.string(),
    line: z.number(),
    path: z.string(),
    side: DiffSideSchema.default(DiffSide.Right).nullish(),
    startLine: z.number().nullish(),
    startSide: DiffSideSchema.default(DiffSide.Right).nullish()
  })
}

export function EnablePullRequestAutoMergeInputSchema(): z.ZodObject<Properties<EnablePullRequestAutoMergeInput>> {
  return z.object({
    authorEmail: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    commitBody: z.string().nullish(),
    commitHeadline: z.string().nullish(),
    expectedHeadOid: z.string().nullish(),
    mergeMethod: PullRequestMergeMethodSchema.default(PullRequestMergeMethod.Merge).nullish(),
    pullRequestId: z.string()
  })
}

export function EnqueuePullRequestInputSchema(): z.ZodObject<Properties<EnqueuePullRequestInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    expectedHeadOid: z.string().nullish(),
    jump: z.boolean().nullish(),
    pullRequestId: z.string()
  })
}

export function EnterpriseAdministratorInvitationOrderSchema(): z.ZodObject<Properties<EnterpriseAdministratorInvitationOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseAdministratorInvitationOrderFieldSchema
  })
}

export function EnterpriseMemberInvitationOrderSchema(): z.ZodObject<Properties<EnterpriseMemberInvitationOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseMemberInvitationOrderFieldSchema
  })
}

export function EnterpriseMemberOrderSchema(): z.ZodObject<Properties<EnterpriseMemberOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseMemberOrderFieldSchema
  })
}

export function EnterpriseOrderSchema(): z.ZodObject<Properties<EnterpriseOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseOrderFieldSchema
  })
}

export function EnterpriseServerInstallationOrderSchema(): z.ZodObject<Properties<EnterpriseServerInstallationOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseServerInstallationOrderFieldSchema
  })
}

export function EnterpriseServerUserAccountEmailOrderSchema(): z.ZodObject<Properties<EnterpriseServerUserAccountEmailOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseServerUserAccountEmailOrderFieldSchema
  })
}

export function EnterpriseServerUserAccountOrderSchema(): z.ZodObject<Properties<EnterpriseServerUserAccountOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseServerUserAccountOrderFieldSchema
  })
}

export function EnterpriseServerUserAccountsUploadOrderSchema(): z.ZodObject<Properties<EnterpriseServerUserAccountsUploadOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnterpriseServerUserAccountsUploadOrderFieldSchema
  })
}

export function EnvironmentsSchema(): z.ZodObject<Properties<Environments>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: EnvironmentOrderFieldSchema
  })
}

export function FileAdditionSchema(): z.ZodObject<Properties<FileAddition>> {
  return z.object({
    contents: z.string(),
    path: z.string()
  })
}

export function FileChangesSchema(): z.ZodObject<Properties<FileChanges>> {
  return z.object({
    additions: z.array(z.lazy(() => FileAdditionSchema())).default([]).nullish(),
    deletions: z.array(z.lazy(() => FileDeletionSchema())).default([]).nullish()
  })
}

export function FileDeletionSchema(): z.ZodObject<Properties<FileDeletion>> {
  return z.object({
    path: z.string()
  })
}

export function FileExtensionRestrictionParametersInputSchema(): z.ZodObject<Properties<FileExtensionRestrictionParametersInput>> {
  return z.object({
    restrictedFileExtensions: z.array(z.string())
  })
}

export function FilePathRestrictionParametersInputSchema(): z.ZodObject<Properties<FilePathRestrictionParametersInput>> {
  return z.object({
    restrictedFilePaths: z.array(z.string())
  })
}

export function FollowOrganizationInputSchema(): z.ZodObject<Properties<FollowOrganizationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    organizationId: z.string()
  })
}

export function FollowUserInputSchema(): z.ZodObject<Properties<FollowUserInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    userId: z.string()
  })
}

export function GistOrderSchema(): z.ZodObject<Properties<GistOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: GistOrderFieldSchema
  })
}

export function GrantEnterpriseOrganizationsMigratorRoleInputSchema(): z.ZodObject<Properties<GrantEnterpriseOrganizationsMigratorRoleInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string()
  })
}

export function GrantMigratorRoleInputSchema(): z.ZodObject<Properties<GrantMigratorRoleInput>> {
  return z.object({
    actor: z.string(),
    actorType: ActorTypeSchema,
    clientMutationId: z.string().nullish(),
    organizationId: z.string()
  })
}

export function ImportProjectInputSchema(): z.ZodObject<Properties<ImportProjectInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    columnImports: z.array(z.lazy(() => ProjectColumnImportSchema())),
    name: z.string(),
    ownerName: z.string(),
    public: z.boolean().default(false).nullish()
  })
}

export function InviteEnterpriseAdminInputSchema(): z.ZodObject<Properties<InviteEnterpriseAdminInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    email: z.string().nullish(),
    enterpriseId: z.string(),
    invitee: z.string().nullish(),
    role: EnterpriseAdministratorRoleSchema.nullish()
  })
}

export function InviteEnterpriseMemberInputSchema(): z.ZodObject<Properties<InviteEnterpriseMemberInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    email: z.string().nullish(),
    enterpriseId: z.string(),
    invitee: z.string().nullish()
  })
}

export function IpAllowListEntryOrderSchema(): z.ZodObject<Properties<IpAllowListEntryOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: IpAllowListEntryOrderFieldSchema
  })
}

export function IssueCommentOrderSchema(): z.ZodObject<Properties<IssueCommentOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: IssueCommentOrderFieldSchema
  })
}

export function IssueFiltersSchema(): z.ZodObject<Properties<IssueFilters>> {
  return z.object({
    assignee: z.string().nullish(),
    createdBy: z.string().nullish(),
    labels: z.array(z.string()).nullish(),
    mentioned: z.string().nullish(),
    milestone: z.string().nullish(),
    milestoneNumber: z.string().nullish(),
    since: z.string().nullish(),
    states: z.array(IssueStateSchema).nullish(),
    viewerSubscribed: z.boolean().default(false).nullish()
  })
}

export function IssueOrderSchema(): z.ZodObject<Properties<IssueOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: IssueOrderFieldSchema
  })
}

export function LabelOrderSchema(): z.ZodObject<Properties<LabelOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: LabelOrderFieldSchema
  })
}

export function LanguageOrderSchema(): z.ZodObject<Properties<LanguageOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: LanguageOrderFieldSchema
  })
}

export function LinkProjectV2ToRepositoryInputSchema(): z.ZodObject<Properties<LinkProjectV2ToRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    repositoryId: z.string()
  })
}

export function LinkProjectV2ToTeamInputSchema(): z.ZodObject<Properties<LinkProjectV2ToTeamInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    teamId: z.string()
  })
}

export function LinkRepositoryToProjectInputSchema(): z.ZodObject<Properties<LinkRepositoryToProjectInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    repositoryId: z.string()
  })
}

export function LockLockableInputSchema(): z.ZodObject<Properties<LockLockableInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    lockReason: LockReasonSchema.nullish(),
    lockableId: z.string()
  })
}

export function MannequinOrderSchema(): z.ZodObject<Properties<MannequinOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: MannequinOrderFieldSchema
  })
}

export function MarkDiscussionCommentAsAnswerInputSchema(): z.ZodObject<Properties<MarkDiscussionCommentAsAnswerInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function MarkFileAsViewedInputSchema(): z.ZodObject<Properties<MarkFileAsViewedInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    path: z.string(),
    pullRequestId: z.string()
  })
}

export function MarkProjectV2AsTemplateInputSchema(): z.ZodObject<Properties<MarkProjectV2AsTemplateInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string()
  })
}

export function MarkPullRequestReadyForReviewInputSchema(): z.ZodObject<Properties<MarkPullRequestReadyForReviewInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string()
  })
}

export function MaxFilePathLengthParametersInputSchema(): z.ZodObject<Properties<MaxFilePathLengthParametersInput>> {
  return z.object({
    maxFilePathLength: z.number()
  })
}

export function MaxFileSizeParametersInputSchema(): z.ZodObject<Properties<MaxFileSizeParametersInput>> {
  return z.object({
    maxFileSize: z.number()
  })
}

export function MergeBranchInputSchema(): z.ZodObject<Properties<MergeBranchInput>> {
  return z.object({
    authorEmail: z.string().nullish(),
    base: z.string(),
    clientMutationId: z.string().nullish(),
    commitMessage: z.string().nullish(),
    head: z.string(),
    repositoryId: z.string()
  })
}

export function MergePullRequestInputSchema(): z.ZodObject<Properties<MergePullRequestInput>> {
  return z.object({
    authorEmail: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    commitBody: z.string().nullish(),
    commitHeadline: z.string().nullish(),
    expectedHeadOid: z.string().nullish(),
    mergeMethod: PullRequestMergeMethodSchema.default(PullRequestMergeMethod.Merge).nullish(),
    pullRequestId: z.string()
  })
}

export function MergeQueueParametersInputSchema(): z.ZodObject<Properties<MergeQueueParametersInput>> {
  return z.object({
    checkResponseTimeoutMinutes: z.number(),
    groupingStrategy: MergeQueueGroupingStrategySchema,
    maxEntriesToBuild: z.number(),
    maxEntriesToMerge: z.number(),
    mergeMethod: MergeQueueMergeMethodSchema,
    minEntriesToMerge: z.number(),
    minEntriesToMergeWaitMinutes: z.number()
  })
}

export function MilestoneOrderSchema(): z.ZodObject<Properties<MilestoneOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: MilestoneOrderFieldSchema
  })
}

export function MinimizeCommentInputSchema(): z.ZodObject<Properties<MinimizeCommentInput>> {
  return z.object({
    classifier: ReportedContentClassifiersSchema,
    clientMutationId: z.string().nullish(),
    subjectId: z.string()
  })
}

export function MoveProjectCardInputSchema(): z.ZodObject<Properties<MoveProjectCardInput>> {
  return z.object({
    afterCardId: z.string().nullish(),
    cardId: z.string(),
    clientMutationId: z.string().nullish(),
    columnId: z.string()
  })
}

export function MoveProjectColumnInputSchema(): z.ZodObject<Properties<MoveProjectColumnInput>> {
  return z.object({
    afterColumnId: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    columnId: z.string()
  })
}

export function OrgEnterpriseOwnerOrderSchema(): z.ZodObject<Properties<OrgEnterpriseOwnerOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: OrgEnterpriseOwnerOrderFieldSchema
  })
}

export function OrganizationOrderSchema(): z.ZodObject<Properties<OrganizationOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: OrganizationOrderFieldSchema
  })
}

export function PackageFileOrderSchema(): z.ZodObject<Properties<PackageFileOrder>> {
  return z.object({
    direction: OrderDirectionSchema.nullish(),
    field: PackageFileOrderFieldSchema.nullish()
  })
}

export function PackageOrderSchema(): z.ZodObject<Properties<PackageOrder>> {
  return z.object({
    direction: OrderDirectionSchema.nullish(),
    field: PackageOrderFieldSchema.nullish()
  })
}

export function PackageVersionOrderSchema(): z.ZodObject<Properties<PackageVersionOrder>> {
  return z.object({
    direction: OrderDirectionSchema.nullish(),
    field: PackageVersionOrderFieldSchema.nullish()
  })
}

export function PinEnvironmentInputSchema(): z.ZodObject<Properties<PinEnvironmentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    environmentId: z.string(),
    pinned: z.boolean()
  })
}

export function PinIssueInputSchema(): z.ZodObject<Properties<PinIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string()
  })
}

export function PinnedEnvironmentOrderSchema(): z.ZodObject<Properties<PinnedEnvironmentOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: PinnedEnvironmentOrderFieldSchema
  })
}

export function ProjectCardImportSchema(): z.ZodObject<Properties<ProjectCardImport>> {
  return z.object({
    number: z.number(),
    repository: z.string()
  })
}

export function ProjectColumnImportSchema(): z.ZodObject<Properties<ProjectColumnImport>> {
  return z.object({
    columnName: z.string(),
    issues: z.array(z.lazy(() => ProjectCardImportSchema())).nullish(),
    position: z.number()
  })
}

export function ProjectOrderSchema(): z.ZodObject<Properties<ProjectOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectOrderFieldSchema
  })
}

export function ProjectV2CollaboratorSchema(): z.ZodObject<Properties<ProjectV2Collaborator>> {
  return z.object({
    role: ProjectV2RolesSchema,
    teamId: z.string().nullish(),
    userId: z.string().nullish()
  })
}

export function ProjectV2FieldOrderSchema(): z.ZodObject<Properties<ProjectV2FieldOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2FieldOrderFieldSchema
  })
}

export function ProjectV2FieldValueSchema(): z.ZodObject<Properties<ProjectV2FieldValue>> {
  return z.object({
    date: z.string().nullish(),
    iterationId: z.string().nullish(),
    number: z.number().nullish(),
    singleSelectOptionId: z.string().nullish(),
    text: z.string().nullish()
  })
}

export function ProjectV2FiltersSchema(): z.ZodObject<Properties<ProjectV2Filters>> {
  return z.object({
    state: ProjectV2StateSchema.nullish()
  })
}

export function ProjectV2ItemFieldValueOrderSchema(): z.ZodObject<Properties<ProjectV2ItemFieldValueOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2ItemFieldValueOrderFieldSchema
  })
}

export function ProjectV2ItemOrderSchema(): z.ZodObject<Properties<ProjectV2ItemOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2ItemOrderFieldSchema
  })
}

export function ProjectV2IterationSchema(): z.ZodObject<Properties<ProjectV2Iteration>> {
  return z.object({
    duration: z.number(),
    startDate: z.string(),
    title: z.string()
  })
}

export function ProjectV2IterationFieldConfigurationInputSchema(): z.ZodObject<Properties<ProjectV2IterationFieldConfigurationInput>> {
  return z.object({
    duration: z.number(),
    iterations: z.array(z.lazy(() => ProjectV2IterationSchema())),
    startDate: z.string()
  })
}

export function ProjectV2OrderSchema(): z.ZodObject<Properties<ProjectV2Order>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2OrderFieldSchema
  })
}

export function ProjectV2SingleSelectFieldOptionInputSchema(): z.ZodObject<Properties<ProjectV2SingleSelectFieldOptionInput>> {
  return z.object({
    color: ProjectV2SingleSelectFieldOptionColorSchema,
    description: z.string(),
    name: z.string()
  })
}

export function ProjectV2StatusOrderSchema(): z.ZodObject<Properties<ProjectV2StatusOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2StatusUpdateOrderFieldSchema
  })
}

export function ProjectV2ViewOrderSchema(): z.ZodObject<Properties<ProjectV2ViewOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2ViewOrderFieldSchema
  })
}

export function ProjectV2WorkflowOrderSchema(): z.ZodObject<Properties<ProjectV2WorkflowOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ProjectV2WorkflowsOrderFieldSchema
  })
}

export function PropertyTargetDefinitionInputSchema(): z.ZodObject<Properties<PropertyTargetDefinitionInput>> {
  return z.object({
    name: z.string(),
    propertyValues: z.array(z.string()),
    source: z.string().nullish()
  })
}

export function PublishSponsorsTierInputSchema(): z.ZodObject<Properties<PublishSponsorsTierInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    tierId: z.string()
  })
}

export function PullRequestOrderSchema(): z.ZodObject<Properties<PullRequestOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: PullRequestOrderFieldSchema
  })
}

export function PullRequestParametersInputSchema(): z.ZodObject<Properties<PullRequestParametersInput>> {
  return z.object({
    allowedMergeMethods: z.array(z.string()).nullish(),
    dismissStaleReviewsOnPush: z.boolean(),
    requireCodeOwnerReview: z.boolean(),
    requireLastPushApproval: z.boolean(),
    requiredApprovingReviewCount: z.number(),
    requiredReviewThreadResolution: z.boolean()
  })
}

export function ReactionOrderSchema(): z.ZodObject<Properties<ReactionOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ReactionOrderFieldSchema
  })
}

export function RefNameConditionTargetInputSchema(): z.ZodObject<Properties<RefNameConditionTargetInput>> {
  return z.object({
    exclude: z.array(z.string()),
    include: z.array(z.string())
  })
}

export function RefOrderSchema(): z.ZodObject<Properties<RefOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: RefOrderFieldSchema
  })
}

export function RefUpdateSchema(): z.ZodObject<Properties<RefUpdate>> {
  return z.object({
    afterOid: z.string(),
    beforeOid: z.string().nullish(),
    force: z.boolean().default(false).nullish(),
    name: z.string()
  })
}

export function RegenerateEnterpriseIdentityProviderRecoveryCodesInputSchema(): z.ZodObject<Properties<RegenerateEnterpriseIdentityProviderRecoveryCodesInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string()
  })
}

export function RegenerateVerifiableDomainTokenInputSchema(): z.ZodObject<Properties<RegenerateVerifiableDomainTokenInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function RejectDeploymentsInputSchema(): z.ZodObject<Properties<RejectDeploymentsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    comment: z.string().default("").nullish(),
    environmentIds: z.array(z.string()),
    workflowRunId: z.string()
  })
}

export function ReleaseOrderSchema(): z.ZodObject<Properties<ReleaseOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: ReleaseOrderFieldSchema
  })
}

export function RemoveAssigneesFromAssignableInputSchema(): z.ZodObject<Properties<RemoveAssigneesFromAssignableInput>> {
  return z.object({
    assignableId: z.string(),
    assigneeIds: z.array(z.string()),
    clientMutationId: z.string().nullish()
  })
}

export function RemoveEnterpriseAdminInputSchema(): z.ZodObject<Properties<RemoveEnterpriseAdminInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string()
  })
}

export function RemoveEnterpriseIdentityProviderInputSchema(): z.ZodObject<Properties<RemoveEnterpriseIdentityProviderInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string()
  })
}

export function RemoveEnterpriseMemberInputSchema(): z.ZodObject<Properties<RemoveEnterpriseMemberInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    userId: z.string()
  })
}

export function RemoveEnterpriseOrganizationInputSchema(): z.ZodObject<Properties<RemoveEnterpriseOrganizationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    organizationId: z.string()
  })
}

export function RemoveEnterpriseSupportEntitlementInputSchema(): z.ZodObject<Properties<RemoveEnterpriseSupportEntitlementInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string()
  })
}

export function RemoveLabelsFromLabelableInputSchema(): z.ZodObject<Properties<RemoveLabelsFromLabelableInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    labelIds: z.array(z.string()),
    labelableId: z.string()
  })
}

export function RemoveOutsideCollaboratorInputSchema(): z.ZodObject<Properties<RemoveOutsideCollaboratorInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    organizationId: z.string(),
    userId: z.string()
  })
}

export function RemoveReactionInputSchema(): z.ZodObject<Properties<RemoveReactionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    content: ReactionContentSchema,
    subjectId: z.string()
  })
}

export function RemoveStarInputSchema(): z.ZodObject<Properties<RemoveStarInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    starrableId: z.string()
  })
}

export function RemoveSubIssueInputSchema(): z.ZodObject<Properties<RemoveSubIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string(),
    subIssueId: z.string()
  })
}

export function RemoveUpvoteInputSchema(): z.ZodObject<Properties<RemoveUpvoteInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    subjectId: z.string()
  })
}

export function ReopenDiscussionInputSchema(): z.ZodObject<Properties<ReopenDiscussionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    discussionId: z.string()
  })
}

export function ReopenIssueInputSchema(): z.ZodObject<Properties<ReopenIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string()
  })
}

export function ReopenPullRequestInputSchema(): z.ZodObject<Properties<ReopenPullRequestInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string()
  })
}

export function ReorderEnvironmentInputSchema(): z.ZodObject<Properties<ReorderEnvironmentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    environmentId: z.string(),
    position: z.number()
  })
}

export function RepositoryIdConditionTargetInputSchema(): z.ZodObject<Properties<RepositoryIdConditionTargetInput>> {
  return z.object({
    repositoryIds: z.array(z.string())
  })
}

export function RepositoryInvitationOrderSchema(): z.ZodObject<Properties<RepositoryInvitationOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: RepositoryInvitationOrderFieldSchema
  })
}

export function RepositoryMigrationOrderSchema(): z.ZodObject<Properties<RepositoryMigrationOrder>> {
  return z.object({
    direction: RepositoryMigrationOrderDirectionSchema,
    field: RepositoryMigrationOrderFieldSchema
  })
}

export function RepositoryNameConditionTargetInputSchema(): z.ZodObject<Properties<RepositoryNameConditionTargetInput>> {
  return z.object({
    exclude: z.array(z.string()),
    include: z.array(z.string()),
    protected: z.boolean().nullish()
  })
}

export function RepositoryOrderSchema(): z.ZodObject<Properties<RepositoryOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: RepositoryOrderFieldSchema
  })
}

export function RepositoryPropertyConditionTargetInputSchema(): z.ZodObject<Properties<RepositoryPropertyConditionTargetInput>> {
  return z.object({
    exclude: z.array(z.lazy(() => PropertyTargetDefinitionInputSchema())),
    include: z.array(z.lazy(() => PropertyTargetDefinitionInputSchema()))
  })
}

export function RepositoryRuleConditionsInputSchema(): z.ZodObject<Properties<RepositoryRuleConditionsInput>> {
  return z.object({
    refName: z.lazy(() => RefNameConditionTargetInputSchema().nullish()),
    repositoryId: z.lazy(() => RepositoryIdConditionTargetInputSchema().nullish()),
    repositoryName: z.lazy(() => RepositoryNameConditionTargetInputSchema().nullish()),
    repositoryProperty: z.lazy(() => RepositoryPropertyConditionTargetInputSchema().nullish())
  })
}

export function RepositoryRuleInputSchema(): z.ZodObject<Properties<RepositoryRuleInput>> {
  return z.object({
    id: z.string().nullish(),
    parameters: z.lazy(() => RuleParametersInputSchema().nullish()),
    type: RepositoryRuleTypeSchema
  })
}

export function RepositoryRuleOrderSchema(): z.ZodObject<Properties<RepositoryRuleOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: RepositoryRuleOrderFieldSchema
  })
}

export function RepositoryRulesetBypassActorInputSchema(): z.ZodObject<Properties<RepositoryRulesetBypassActorInput>> {
  return z.object({
    actorId: z.string().nullish(),
    bypassMode: RepositoryRulesetBypassActorBypassModeSchema,
    deployKey: z.boolean().nullish(),
    enterpriseOwner: z.boolean().nullish(),
    organizationAdmin: z.boolean().nullish(),
    repositoryRoleDatabaseId: z.number().nullish()
  })
}

export function ReprioritizeSubIssueInputSchema(): z.ZodObject<Properties<ReprioritizeSubIssueInput>> {
  return z.object({
    afterId: z.string().nullish(),
    beforeId: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    issueId: z.string(),
    subIssueId: z.string()
  })
}

export function RequestReviewsInputSchema(): z.ZodObject<Properties<RequestReviewsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    pullRequestId: z.string(),
    teamIds: z.array(z.string()).nullish(),
    union: z.boolean().default(false).nullish(),
    userIds: z.array(z.string()).nullish()
  })
}

export function RequiredDeploymentsParametersInputSchema(): z.ZodObject<Properties<RequiredDeploymentsParametersInput>> {
  return z.object({
    requiredDeploymentEnvironments: z.array(z.string())
  })
}

export function RequiredStatusCheckInputSchema(): z.ZodObject<Properties<RequiredStatusCheckInput>> {
  return z.object({
    appId: z.string().nullish(),
    context: z.string()
  })
}

export function RequiredStatusChecksParametersInputSchema(): z.ZodObject<Properties<RequiredStatusChecksParametersInput>> {
  return z.object({
    doNotEnforceOnCreate: z.boolean().nullish(),
    requiredStatusChecks: z.array(z.lazy(() => StatusCheckConfigurationInputSchema())),
    strictRequiredStatusChecksPolicy: z.boolean()
  })
}

export function RerequestCheckSuiteInputSchema(): z.ZodObject<Properties<RerequestCheckSuiteInput>> {
  return z.object({
    checkSuiteId: z.string(),
    clientMutationId: z.string().nullish(),
    repositoryId: z.string()
  })
}

export function ResolveReviewThreadInputSchema(): z.ZodObject<Properties<ResolveReviewThreadInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    threadId: z.string()
  })
}

export function RetireSponsorsTierInputSchema(): z.ZodObject<Properties<RetireSponsorsTierInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    tierId: z.string()
  })
}

export function RevertPullRequestInputSchema(): z.ZodObject<Properties<RevertPullRequestInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    draft: z.boolean().default(false).nullish(),
    pullRequestId: z.string(),
    title: z.string().nullish()
  })
}

export function RevokeEnterpriseOrganizationsMigratorRoleInputSchema(): z.ZodObject<Properties<RevokeEnterpriseOrganizationsMigratorRoleInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string()
  })
}

export function RevokeMigratorRoleInputSchema(): z.ZodObject<Properties<RevokeMigratorRoleInput>> {
  return z.object({
    actor: z.string(),
    actorType: ActorTypeSchema,
    clientMutationId: z.string().nullish(),
    organizationId: z.string()
  })
}

export function RuleParametersInputSchema(): z.ZodObject<Properties<RuleParametersInput>> {
  return z.object({
    branchNamePattern: z.lazy(() => BranchNamePatternParametersInputSchema().nullish()),
    codeScanning: z.lazy(() => CodeScanningParametersInputSchema().nullish()),
    commitAuthorEmailPattern: z.lazy(() => CommitAuthorEmailPatternParametersInputSchema().nullish()),
    commitMessagePattern: z.lazy(() => CommitMessagePatternParametersInputSchema().nullish()),
    committerEmailPattern: z.lazy(() => CommitterEmailPatternParametersInputSchema().nullish()),
    fileExtensionRestriction: z.lazy(() => FileExtensionRestrictionParametersInputSchema().nullish()),
    filePathRestriction: z.lazy(() => FilePathRestrictionParametersInputSchema().nullish()),
    maxFilePathLength: z.lazy(() => MaxFilePathLengthParametersInputSchema().nullish()),
    maxFileSize: z.lazy(() => MaxFileSizeParametersInputSchema().nullish()),
    mergeQueue: z.lazy(() => MergeQueueParametersInputSchema().nullish()),
    pullRequest: z.lazy(() => PullRequestParametersInputSchema().nullish()),
    requiredDeployments: z.lazy(() => RequiredDeploymentsParametersInputSchema().nullish()),
    requiredStatusChecks: z.lazy(() => RequiredStatusChecksParametersInputSchema().nullish()),
    tagNamePattern: z.lazy(() => TagNamePatternParametersInputSchema().nullish()),
    update: z.lazy(() => UpdateParametersInputSchema().nullish()),
    workflows: z.lazy(() => WorkflowsParametersInputSchema().nullish())
  })
}

export function SavedReplyOrderSchema(): z.ZodObject<Properties<SavedReplyOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SavedReplyOrderFieldSchema
  })
}

export function SecurityAdvisoryIdentifierFilterSchema(): z.ZodObject<Properties<SecurityAdvisoryIdentifierFilter>> {
  return z.object({
    type: SecurityAdvisoryIdentifierTypeSchema,
    value: z.string()
  })
}

export function SecurityAdvisoryOrderSchema(): z.ZodObject<Properties<SecurityAdvisoryOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SecurityAdvisoryOrderFieldSchema
  })
}

export function SecurityVulnerabilityOrderSchema(): z.ZodObject<Properties<SecurityVulnerabilityOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SecurityVulnerabilityOrderFieldSchema
  })
}

export function SetEnterpriseIdentityProviderInputSchema(): z.ZodObject<Properties<SetEnterpriseIdentityProviderInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    digestMethod: SamlDigestAlgorithmSchema,
    enterpriseId: z.string(),
    idpCertificate: z.string(),
    issuer: z.string().nullish(),
    signatureMethod: SamlSignatureAlgorithmSchema,
    ssoUrl: z.string()
  })
}

export function SetOrganizationInteractionLimitInputSchema(): z.ZodObject<Properties<SetOrganizationInteractionLimitInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    expiry: RepositoryInteractionLimitExpirySchema.nullish(),
    limit: RepositoryInteractionLimitSchema,
    organizationId: z.string()
  })
}

export function SetRepositoryInteractionLimitInputSchema(): z.ZodObject<Properties<SetRepositoryInteractionLimitInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    expiry: RepositoryInteractionLimitExpirySchema.nullish(),
    limit: RepositoryInteractionLimitSchema,
    repositoryId: z.string()
  })
}

export function SetUserInteractionLimitInputSchema(): z.ZodObject<Properties<SetUserInteractionLimitInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    expiry: RepositoryInteractionLimitExpirySchema.nullish(),
    limit: RepositoryInteractionLimitSchema,
    userId: z.string()
  })
}

export function SponsorAndLifetimeValueOrderSchema(): z.ZodObject<Properties<SponsorAndLifetimeValueOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorAndLifetimeValueOrderFieldSchema
  })
}

export function SponsorOrderSchema(): z.ZodObject<Properties<SponsorOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorOrderFieldSchema
  })
}

export function SponsorableOrderSchema(): z.ZodObject<Properties<SponsorableOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorableOrderFieldSchema
  })
}

export function SponsorsActivityOrderSchema(): z.ZodObject<Properties<SponsorsActivityOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorsActivityOrderFieldSchema
  })
}

export function SponsorsTierOrderSchema(): z.ZodObject<Properties<SponsorsTierOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorsTierOrderFieldSchema
  })
}

export function SponsorshipNewsletterOrderSchema(): z.ZodObject<Properties<SponsorshipNewsletterOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorshipNewsletterOrderFieldSchema
  })
}

export function SponsorshipOrderSchema(): z.ZodObject<Properties<SponsorshipOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: SponsorshipOrderFieldSchema
  })
}

export function StarOrderSchema(): z.ZodObject<Properties<StarOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: StarOrderFieldSchema
  })
}

export function StartOrganizationMigrationInputSchema(): z.ZodObject<Properties<StartOrganizationMigrationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    sourceAccessToken: z.string(),
    sourceOrgUrl: z.string(),
    targetEnterpriseId: z.string(),
    targetOrgName: z.string()
  })
}

export function StartRepositoryMigrationInputSchema(): z.ZodObject<Properties<StartRepositoryMigrationInput>> {
  return z.object({
    accessToken: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    continueOnError: z.boolean().nullish(),
    gitArchiveUrl: z.string().nullish(),
    githubPat: z.string().nullish(),
    lockSource: z.boolean().nullish(),
    metadataArchiveUrl: z.string().nullish(),
    ownerId: z.string(),
    repositoryName: z.string(),
    skipReleases: z.boolean().nullish(),
    sourceId: z.string(),
    sourceRepositoryUrl: z.string(),
    targetRepoVisibility: z.string().nullish()
  })
}

export function StatusCheckConfigurationInputSchema(): z.ZodObject<Properties<StatusCheckConfigurationInput>> {
  return z.object({
    context: z.string(),
    integrationId: z.number().nullish()
  })
}

export function SubmitPullRequestReviewInputSchema(): z.ZodObject<Properties<SubmitPullRequestReviewInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    event: PullRequestReviewEventSchema,
    pullRequestId: z.string().nullish(),
    pullRequestReviewId: z.string().nullish()
  })
}

export function TagNamePatternParametersInputSchema(): z.ZodObject<Properties<TagNamePatternParametersInput>> {
  return z.object({
    name: z.string().nullish(),
    negate: z.boolean().nullish(),
    operator: z.string(),
    pattern: z.string()
  })
}

export function TeamDiscussionCommentOrderSchema(): z.ZodObject<Properties<TeamDiscussionCommentOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: TeamDiscussionCommentOrderFieldSchema
  })
}

export function TeamDiscussionOrderSchema(): z.ZodObject<Properties<TeamDiscussionOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: TeamDiscussionOrderFieldSchema
  })
}

export function TeamMemberOrderSchema(): z.ZodObject<Properties<TeamMemberOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: TeamMemberOrderFieldSchema
  })
}

export function TeamOrderSchema(): z.ZodObject<Properties<TeamOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: TeamOrderFieldSchema
  })
}

export function TeamRepositoryOrderSchema(): z.ZodObject<Properties<TeamRepositoryOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: TeamRepositoryOrderFieldSchema
  })
}

export function TransferEnterpriseOrganizationInputSchema(): z.ZodObject<Properties<TransferEnterpriseOrganizationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    destinationEnterpriseId: z.string(),
    organizationId: z.string()
  })
}

export function TransferIssueInputSchema(): z.ZodObject<Properties<TransferIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    createLabelsIfMissing: z.boolean().default(false).nullish(),
    issueId: z.string(),
    repositoryId: z.string()
  })
}

export function UnarchiveProjectV2ItemInputSchema(): z.ZodObject<Properties<UnarchiveProjectV2ItemInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    projectId: z.string()
  })
}

export function UnarchiveRepositoryInputSchema(): z.ZodObject<Properties<UnarchiveRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    repositoryId: z.string()
  })
}

export function UnfollowOrganizationInputSchema(): z.ZodObject<Properties<UnfollowOrganizationInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    organizationId: z.string()
  })
}

export function UnfollowUserInputSchema(): z.ZodObject<Properties<UnfollowUserInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    userId: z.string()
  })
}

export function UnlinkProjectV2FromRepositoryInputSchema(): z.ZodObject<Properties<UnlinkProjectV2FromRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    repositoryId: z.string()
  })
}

export function UnlinkProjectV2FromTeamInputSchema(): z.ZodObject<Properties<UnlinkProjectV2FromTeamInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    teamId: z.string()
  })
}

export function UnlinkRepositoryFromProjectInputSchema(): z.ZodObject<Properties<UnlinkRepositoryFromProjectInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string(),
    repositoryId: z.string()
  })
}

export function UnlockLockableInputSchema(): z.ZodObject<Properties<UnlockLockableInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    lockableId: z.string()
  })
}

export function UnmarkDiscussionCommentAsAnswerInputSchema(): z.ZodObject<Properties<UnmarkDiscussionCommentAsAnswerInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function UnmarkFileAsViewedInputSchema(): z.ZodObject<Properties<UnmarkFileAsViewedInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    path: z.string(),
    pullRequestId: z.string()
  })
}

export function UnmarkIssueAsDuplicateInputSchema(): z.ZodObject<Properties<UnmarkIssueAsDuplicateInput>> {
  return z.object({
    canonicalId: z.string(),
    clientMutationId: z.string().nullish(),
    duplicateId: z.string()
  })
}

export function UnmarkProjectV2AsTemplateInputSchema(): z.ZodObject<Properties<UnmarkProjectV2AsTemplateInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    projectId: z.string()
  })
}

export function UnminimizeCommentInputSchema(): z.ZodObject<Properties<UnminimizeCommentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    subjectId: z.string()
  })
}

export function UnpinIssueInputSchema(): z.ZodObject<Properties<UnpinIssueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    issueId: z.string()
  })
}

export function UnresolveReviewThreadInputSchema(): z.ZodObject<Properties<UnresolveReviewThreadInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    threadId: z.string()
  })
}

export function UpdateBranchProtectionRuleInputSchema(): z.ZodObject<Properties<UpdateBranchProtectionRuleInput>> {
  return z.object({
    allowsDeletions: z.boolean().nullish(),
    allowsForcePushes: z.boolean().nullish(),
    blocksCreations: z.boolean().nullish(),
    branchProtectionRuleId: z.string(),
    bypassForcePushActorIds: z.array(z.string()).nullish(),
    bypassPullRequestActorIds: z.array(z.string()).nullish(),
    clientMutationId: z.string().nullish(),
    dismissesStaleReviews: z.boolean().nullish(),
    isAdminEnforced: z.boolean().nullish(),
    lockAllowsFetchAndMerge: z.boolean().nullish(),
    lockBranch: z.boolean().nullish(),
    pattern: z.string().nullish(),
    pushActorIds: z.array(z.string()).nullish(),
    requireLastPushApproval: z.boolean().nullish(),
    requiredApprovingReviewCount: z.number().nullish(),
    requiredDeploymentEnvironments: z.array(z.string()).nullish(),
    requiredStatusCheckContexts: z.array(z.string()).nullish(),
    requiredStatusChecks: z.array(z.lazy(() => RequiredStatusCheckInputSchema())).nullish(),
    requiresApprovingReviews: z.boolean().nullish(),
    requiresCodeOwnerReviews: z.boolean().nullish(),
    requiresCommitSignatures: z.boolean().nullish(),
    requiresConversationResolution: z.boolean().nullish(),
    requiresDeployments: z.boolean().nullish(),
    requiresLinearHistory: z.boolean().nullish(),
    requiresStatusChecks: z.boolean().nullish(),
    requiresStrictStatusChecks: z.boolean().nullish(),
    restrictsPushes: z.boolean().nullish(),
    restrictsReviewDismissals: z.boolean().nullish(),
    reviewDismissalActorIds: z.array(z.string()).nullish()
  })
}

export function UpdateCheckRunInputSchema(): z.ZodObject<Properties<UpdateCheckRunInput>> {
  return z.object({
    actions: z.array(z.lazy(() => CheckRunActionSchema())).nullish(),
    checkRunId: z.string(),
    clientMutationId: z.string().nullish(),
    completedAt: z.string().nullish(),
    conclusion: CheckConclusionStateSchema.nullish(),
    detailsUrl: z.string().nullish(),
    externalId: z.string().nullish(),
    name: z.string().nullish(),
    output: z.lazy(() => CheckRunOutputSchema().nullish()),
    repositoryId: z.string(),
    startedAt: z.string().nullish(),
    status: RequestableCheckStatusStateSchema.nullish()
  })
}

export function UpdateCheckSuitePreferencesInputSchema(): z.ZodObject<Properties<UpdateCheckSuitePreferencesInput>> {
  return z.object({
    autoTriggerPreferences: z.array(z.lazy(() => CheckSuiteAutoTriggerPreferenceSchema())),
    clientMutationId: z.string().nullish(),
    repositoryId: z.string()
  })
}

export function UpdateDiscussionCommentInputSchema(): z.ZodObject<Properties<UpdateDiscussionCommentInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    commentId: z.string()
  })
}

export function UpdateDiscussionInputSchema(): z.ZodObject<Properties<UpdateDiscussionInput>> {
  return z.object({
    body: z.string().nullish(),
    categoryId: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    discussionId: z.string(),
    title: z.string().nullish()
  })
}

export function UpdateEnterpriseAdministratorRoleInputSchema(): z.ZodObject<Properties<UpdateEnterpriseAdministratorRoleInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    login: z.string(),
    role: EnterpriseAdministratorRoleSchema
  })
}

export function UpdateEnterpriseAllowPrivateRepositoryForkingSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseAllowPrivateRepositoryForkingSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    policyValue: EnterpriseAllowPrivateRepositoryForkingPolicyValueSchema.nullish(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseDefaultRepositoryPermissionSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseDefaultRepositoryPermissionSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseDefaultRepositoryPermissionSettingValueSchema
  })
}

export function UpdateEnterpriseDeployKeySettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseDeployKeySettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanChangeRepositoryVisibilitySettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanChangeRepositoryVisibilitySettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanCreateRepositoriesSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanCreateRepositoriesSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    membersCanCreateInternalRepositories: z.boolean().nullish(),
    membersCanCreatePrivateRepositories: z.boolean().nullish(),
    membersCanCreatePublicRepositories: z.boolean().nullish(),
    membersCanCreateRepositoriesPolicyEnabled: z.boolean().nullish(),
    settingValue: EnterpriseMembersCanCreateRepositoriesSettingValueSchema.nullish()
  })
}

export function UpdateEnterpriseMembersCanDeleteIssuesSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanDeleteIssuesSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanDeleteRepositoriesSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanDeleteRepositoriesSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanInviteCollaboratorsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanInviteCollaboratorsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanMakePurchasesSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanMakePurchasesSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseMembersCanMakePurchasesSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanUpdateProtectedBranchesSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanUpdateProtectedBranchesSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseMembersCanViewDependencyInsightsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseMembersCanViewDependencyInsightsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseOrganizationProjectsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseOrganizationProjectsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseOwnerOrganizationRoleInputSchema(): z.ZodObject<Properties<UpdateEnterpriseOwnerOrganizationRoleInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    organizationId: z.string(),
    organizationRole: RoleInOrganizationSchema
  })
}

export function UpdateEnterpriseProfileInputSchema(): z.ZodObject<Properties<UpdateEnterpriseProfileInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    enterpriseId: z.string(),
    location: z.string().nullish(),
    name: z.string().nullish(),
    websiteUrl: z.string().nullish()
  })
}

export function UpdateEnterpriseRepositoryProjectsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseRepositoryProjectsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseTeamDiscussionsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseTeamDiscussionsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledDisabledSettingValueSchema
  })
}

export function UpdateEnterpriseTwoFactorAuthenticationDisallowedMethodsSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseTwoFactorAuthenticationDisallowedMethodsSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseDisallowedMethodsSettingValueSchema
  })
}

export function UpdateEnterpriseTwoFactorAuthenticationRequiredSettingInputSchema(): z.ZodObject<Properties<UpdateEnterpriseTwoFactorAuthenticationRequiredSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enterpriseId: z.string(),
    settingValue: EnterpriseEnabledSettingValueSchema
  })
}

export function UpdateEnvironmentInputSchema(): z.ZodObject<Properties<UpdateEnvironmentInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    environmentId: z.string(),
    preventSelfReview: z.boolean().nullish(),
    reviewers: z.array(z.string()).nullish(),
    waitTimer: z.number().nullish()
  })
}

export function UpdateIpAllowListEnabledSettingInputSchema(): z.ZodObject<Properties<UpdateIpAllowListEnabledSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string(),
    settingValue: IpAllowListEnabledSettingValueSchema
  })
}

export function UpdateIpAllowListEntryInputSchema(): z.ZodObject<Properties<UpdateIpAllowListEntryInput>> {
  return z.object({
    allowListValue: z.string(),
    clientMutationId: z.string().nullish(),
    ipAllowListEntryId: z.string(),
    isActive: z.boolean(),
    name: z.string().nullish()
  })
}

export function UpdateIpAllowListForInstalledAppsEnabledSettingInputSchema(): z.ZodObject<Properties<UpdateIpAllowListForInstalledAppsEnabledSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string(),
    settingValue: IpAllowListForInstalledAppsEnabledSettingValueSchema
  })
}

export function UpdateIssueCommentInputSchema(): z.ZodObject<Properties<UpdateIssueCommentInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function UpdateIssueInputSchema(): z.ZodObject<Properties<UpdateIssueInput>> {
  return z.object({
    assigneeIds: z.array(z.string()).nullish(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    id: z.string(),
    labelIds: z.array(z.string()).nullish(),
    milestoneId: z.string().nullish(),
    projectIds: z.array(z.string()).nullish(),
    state: IssueStateSchema.nullish(),
    title: z.string().nullish()
  })
}

export function UpdateLabelInputSchema(): z.ZodObject<Properties<UpdateLabelInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    color: z.string().nullish(),
    description: z.string().nullish(),
    id: z.string(),
    name: z.string().nullish()
  })
}

export function UpdateNotificationRestrictionSettingInputSchema(): z.ZodObject<Properties<UpdateNotificationRestrictionSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    ownerId: z.string(),
    settingValue: NotificationRestrictionSettingValueSchema
  })
}

export function UpdateOrganizationAllowPrivateRepositoryForkingSettingInputSchema(): z.ZodObject<Properties<UpdateOrganizationAllowPrivateRepositoryForkingSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    forkingEnabled: z.boolean(),
    organizationId: z.string()
  })
}

export function UpdateOrganizationWebCommitSignoffSettingInputSchema(): z.ZodObject<Properties<UpdateOrganizationWebCommitSignoffSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    organizationId: z.string(),
    webCommitSignoffRequired: z.boolean()
  })
}

export function UpdateParametersInputSchema(): z.ZodObject<Properties<UpdateParametersInput>> {
  return z.object({
    updateAllowsFetchAndMerge: z.boolean()
  })
}

export function UpdatePatreonSponsorabilityInputSchema(): z.ZodObject<Properties<UpdatePatreonSponsorabilityInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    enablePatreonSponsorships: z.boolean(),
    sponsorableLogin: z.string().nullish()
  })
}

export function UpdateProjectCardInputSchema(): z.ZodObject<Properties<UpdateProjectCardInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    isArchived: z.boolean().nullish(),
    note: z.string().nullish(),
    projectCardId: z.string()
  })
}

export function UpdateProjectColumnInputSchema(): z.ZodObject<Properties<UpdateProjectColumnInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    name: z.string(),
    projectColumnId: z.string()
  })
}

export function UpdateProjectInputSchema(): z.ZodObject<Properties<UpdateProjectInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    name: z.string().nullish(),
    projectId: z.string(),
    public: z.boolean().nullish(),
    state: ProjectStateSchema.nullish()
  })
}

export function UpdateProjectV2CollaboratorsInputSchema(): z.ZodObject<Properties<UpdateProjectV2CollaboratorsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    collaborators: z.array(z.lazy(() => ProjectV2CollaboratorSchema())),
    projectId: z.string()
  })
}

export function UpdateProjectV2DraftIssueInputSchema(): z.ZodObject<Properties<UpdateProjectV2DraftIssueInput>> {
  return z.object({
    assigneeIds: z.array(z.string()).nullish(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    draftIssueId: z.string(),
    title: z.string().nullish()
  })
}

export function UpdateProjectV2FieldInputSchema(): z.ZodObject<Properties<UpdateProjectV2FieldInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    fieldId: z.string(),
    iterationConfiguration: z.lazy(() => ProjectV2IterationFieldConfigurationInputSchema().nullish()),
    name: z.string().nullish(),
    singleSelectOptions: z.array(z.lazy(() => ProjectV2SingleSelectFieldOptionInputSchema())).nullish()
  })
}

export function UpdateProjectV2InputSchema(): z.ZodObject<Properties<UpdateProjectV2Input>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    closed: z.boolean().nullish(),
    projectId: z.string(),
    public: z.boolean().nullish(),
    readme: z.string().nullish(),
    shortDescription: z.string().nullish(),
    title: z.string().nullish()
  })
}

export function UpdateProjectV2ItemFieldValueInputSchema(): z.ZodObject<Properties<UpdateProjectV2ItemFieldValueInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    fieldId: z.string(),
    itemId: z.string(),
    projectId: z.string(),
    value: z.lazy(() => ProjectV2FieldValueSchema())
  })
}

export function UpdateProjectV2ItemPositionInputSchema(): z.ZodObject<Properties<UpdateProjectV2ItemPositionInput>> {
  return z.object({
    afterId: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    projectId: z.string()
  })
}

export function UpdateProjectV2StatusUpdateInputSchema(): z.ZodObject<Properties<UpdateProjectV2StatusUpdateInput>> {
  return z.object({
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    startDate: z.string().nullish(),
    status: ProjectV2StatusUpdateStatusSchema.nullish(),
    statusUpdateId: z.string(),
    targetDate: z.string().nullish()
  })
}

export function UpdatePullRequestBranchInputSchema(): z.ZodObject<Properties<UpdatePullRequestBranchInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    expectedHeadOid: z.string().nullish(),
    pullRequestId: z.string(),
    updateMethod: PullRequestBranchUpdateMethodSchema.nullish()
  })
}

export function UpdatePullRequestInputSchema(): z.ZodObject<Properties<UpdatePullRequestInput>> {
  return z.object({
    assigneeIds: z.array(z.string()).nullish(),
    baseRefName: z.string().nullish(),
    body: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    labelIds: z.array(z.string()).nullish(),
    maintainerCanModify: z.boolean().nullish(),
    milestoneId: z.string().nullish(),
    projectIds: z.array(z.string()).nullish(),
    pullRequestId: z.string(),
    state: PullRequestUpdateStateSchema.nullish(),
    title: z.string().nullish()
  })
}

export function UpdatePullRequestReviewCommentInputSchema(): z.ZodObject<Properties<UpdatePullRequestReviewCommentInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    pullRequestReviewCommentId: z.string()
  })
}

export function UpdatePullRequestReviewInputSchema(): z.ZodObject<Properties<UpdatePullRequestReviewInput>> {
  return z.object({
    body: z.string(),
    clientMutationId: z.string().nullish(),
    pullRequestReviewId: z.string()
  })
}

export function UpdateRefInputSchema(): z.ZodObject<Properties<UpdateRefInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    force: z.boolean().default(false).nullish(),
    oid: z.string(),
    refId: z.string()
  })
}

export function UpdateRefsInputSchema(): z.ZodObject<Properties<UpdateRefsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    refUpdates: z.array(z.lazy(() => RefUpdateSchema())),
    repositoryId: z.string()
  })
}

export function UpdateRepositoryInputSchema(): z.ZodObject<Properties<UpdateRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    hasDiscussionsEnabled: z.boolean().nullish(),
    hasIssuesEnabled: z.boolean().nullish(),
    hasProjectsEnabled: z.boolean().nullish(),
    hasSponsorshipsEnabled: z.boolean().nullish(),
    hasWikiEnabled: z.boolean().nullish(),
    homepageUrl: z.string().nullish(),
    name: z.string().nullish(),
    repositoryId: z.string(),
    template: z.boolean().nullish()
  })
}

export function UpdateRepositoryRulesetInputSchema(): z.ZodObject<Properties<UpdateRepositoryRulesetInput>> {
  return z.object({
    bypassActors: z.array(z.lazy(() => RepositoryRulesetBypassActorInputSchema())).nullish(),
    clientMutationId: z.string().nullish(),
    conditions: z.lazy(() => RepositoryRuleConditionsInputSchema().nullish()),
    enforcement: RuleEnforcementSchema.nullish(),
    name: z.string().nullish(),
    repositoryRulesetId: z.string(),
    rules: z.array(z.lazy(() => RepositoryRuleInputSchema())).nullish(),
    target: RepositoryRulesetTargetSchema.nullish()
  })
}

export function UpdateRepositoryWebCommitSignoffSettingInputSchema(): z.ZodObject<Properties<UpdateRepositoryWebCommitSignoffSettingInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    repositoryId: z.string(),
    webCommitSignoffRequired: z.boolean()
  })
}

export function UpdateSponsorshipPreferencesInputSchema(): z.ZodObject<Properties<UpdateSponsorshipPreferencesInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    privacyLevel: SponsorshipPrivacySchema.default(SponsorshipPrivacy.Public).nullish(),
    receiveEmails: z.boolean().default(true).nullish(),
    sponsorId: z.string().nullish(),
    sponsorLogin: z.string().nullish(),
    sponsorableId: z.string().nullish(),
    sponsorableLogin: z.string().nullish()
  })
}

export function UpdateSubscriptionInputSchema(): z.ZodObject<Properties<UpdateSubscriptionInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    state: SubscriptionStateSchema,
    subscribableId: z.string()
  })
}

export function UpdateTeamDiscussionCommentInputSchema(): z.ZodObject<Properties<UpdateTeamDiscussionCommentInput>> {
  return z.object({
    body: z.string(),
    bodyVersion: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function UpdateTeamDiscussionInputSchema(): z.ZodObject<Properties<UpdateTeamDiscussionInput>> {
  return z.object({
    body: z.string().nullish(),
    bodyVersion: z.string().nullish(),
    clientMutationId: z.string().nullish(),
    id: z.string(),
    pinned: z.boolean().nullish(),
    title: z.string().nullish()
  })
}

export function UpdateTeamReviewAssignmentInputSchema(): z.ZodObject<Properties<UpdateTeamReviewAssignmentInput>> {
  return z.object({
    algorithm: TeamReviewAssignmentAlgorithmSchema.default(TeamReviewAssignmentAlgorithm.RoundRobin).nullish(),
    clientMutationId: z.string().nullish(),
    countMembersAlreadyRequested: z.boolean().default(true).nullish(),
    enabled: z.boolean(),
    excludedTeamMemberIds: z.array(z.string()).nullish(),
    id: z.string(),
    includeChildTeamMembers: z.boolean().default(true).nullish(),
    notifyTeam: z.boolean().default(true).nullish(),
    removeTeamRequest: z.boolean().default(true).nullish(),
    teamMemberCount: z.number().default(1).nullish()
  })
}

export function UpdateTeamsRepositoryInputSchema(): z.ZodObject<Properties<UpdateTeamsRepositoryInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    permission: RepositoryPermissionSchema,
    repositoryId: z.string(),
    teamIds: z.array(z.string())
  })
}

export function UpdateTopicsInputSchema(): z.ZodObject<Properties<UpdateTopicsInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    repositoryId: z.string(),
    topicNames: z.array(z.string())
  })
}

export function UpdateUserListInputSchema(): z.ZodObject<Properties<UpdateUserListInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    description: z.string().nullish(),
    isPrivate: z.boolean().nullish(),
    listId: z.string(),
    name: z.string().nullish()
  })
}

export function UpdateUserListsForItemInputSchema(): z.ZodObject<Properties<UpdateUserListsForItemInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    itemId: z.string(),
    listIds: z.array(z.string()),
    suggestedListIds: z.array(z.string()).nullish()
  })
}

export function UserStatusOrderSchema(): z.ZodObject<Properties<UserStatusOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: UserStatusOrderFieldSchema
  })
}

export function VerifiableDomainOrderSchema(): z.ZodObject<Properties<VerifiableDomainOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: VerifiableDomainOrderFieldSchema
  })
}

export function VerifyVerifiableDomainInputSchema(): z.ZodObject<Properties<VerifyVerifiableDomainInput>> {
  return z.object({
    clientMutationId: z.string().nullish(),
    id: z.string()
  })
}

export function WorkflowFileReferenceInputSchema(): z.ZodObject<Properties<WorkflowFileReferenceInput>> {
  return z.object({
    path: z.string(),
    ref: z.string().nullish(),
    repositoryId: z.number(),
    sha: z.string().nullish()
  })
}

export function WorkflowRunOrderSchema(): z.ZodObject<Properties<WorkflowRunOrder>> {
  return z.object({
    direction: OrderDirectionSchema,
    field: WorkflowRunOrderFieldSchema
  })
}

export function WorkflowsParametersInputSchema(): z.ZodObject<Properties<WorkflowsParametersInput>> {
  return z.object({
    doNotEnforceOnCreate: z.boolean().nullish(),
    workflows: z.array(z.lazy(() => WorkflowFileReferenceInputSchema()))
  })
}

export function SearchPrsQuerySchema(): z.ZodType<SearchPrsQuery> {
  return z.object({
    rateLimit: z.object({
    remaining: z.number(),
    resetAt: z.string()
}).nullable(),
    viewer: z.object({
    login: z.string()
}),
    search: z.object({
    nodes: z.array(z.union([
    z.object({
    __typename: z.literal('App')
}),
    z.object({
    __typename: z.literal('Discussion')
}),
    z.object({
    __typename: z.literal('Issue')
}),
    z.object({
    __typename: z.literal('MarketplaceListing')
}),
    z.object({
    __typename: z.literal('Organization')
}),
    z.object({
    __typename: z.literal('PullRequest'),
    number: z.number(),
    title: z.string(),
    url: z.string(),
    state: PullRequestStateSchema,
    mergedAt: z.string().nullable(),
    closedAt: z.string().nullable(),
    reviewDecision: PullRequestReviewDecisionSchema.nullable(),
    mergeable: MergeableStateSchema,
    mergeStateStatus: MergeStateStatusSchema,
    repository: z.object({
    owner: z.union([
    z.object({
    login: z.string(),
    __typename: z.literal('Organization')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('User')
})
]),
    name: z.string()
}),
    reviews: z.object({
    nodes: z.array(z.object({
    id: z.string(),
    author: z.union([
    z.object({
    login: z.string(),
    __typename: z.literal('Bot')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('EnterpriseUserAccount')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('Mannequin')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('Organization')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('User')
})
]).nullable(),
    state: PullRequestReviewStateSchema,
    submittedAt: z.string().nullable(),
    body: z.string(),
    url: z.string()
}).nullable()).nullable()
}).nullable(),
    comments: z.object({
    nodes: z.array(z.object({
    author: z.union([
    z.object({
    login: z.string(),
    __typename: z.literal('Bot')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('EnterpriseUserAccount')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('Mannequin')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('Organization')
}),
    z.object({
    login: z.string(),
    __typename: z.literal('User')
})
]).nullable(),
    createdAt: z.string(),
    body: z.string(),
    url: z.string()
}).nullable()).nullable()
}),
    reviewThreads: z.object({
    nodes: z.array(z.object({
    id: z.string(),
    isResolved: z.boolean(),
    path: z.string(),
    comments: z.object({
    nodes: z.array(z.object({
    pullRequestReview: z.object({
    submittedAt: z.string().nullable()
}).nullable()
}).nullable()).nullable()
})
}).nullable()).nullable()
}),
    commits: z.object({
    nodes: z.array(z.object({
    commit: z.object({
    statusCheckRollup: z.object({
    contexts: z.object({
    nodes: z.array(z.union([
    z.object({
    __typename: z.literal('CheckRun'),
    name: z.string(),
    conclusion: CheckConclusionStateSchema.nullable()
}),
    z.object({
    __typename: z.literal('StatusContext'),
    context: z.string(),
    state: StatusStateSchema
})
]).nullable()).nullable()
})
}).nullable()
})
}).nullable()).nullable()
})
}),
    z.object({
    __typename: z.literal('Repository')
}),
    z.object({
    __typename: z.literal('User')
})
]).nullable()).nullable()
})
})
}
