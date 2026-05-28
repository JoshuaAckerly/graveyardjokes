export type StarRating = 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';

export interface Reviewer {
    displayName: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
}

export interface ReviewReply {
    comment: string;
    updateTime: string;
}

export interface Review {
    reviewId: string;
    reviewer: Reviewer;
    starRating: StarRating;
    comment?: string;
    createTime: string;
    updateTime: string;
    reviewReply?: ReviewReply;
    name: string;
}

export interface ReviewsResponse {
    reviews?: Review[];
    averageRating?: number;
    totalReviewCount?: number;
    nextPageToken?: string;
}

// ---- Business Info / Hours ----

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface TimeOfDay {
    hours: number;
    minutes: number;
}

export interface TimePeriod {
    openDay: DayOfWeek;
    openTime: TimeOfDay;
    closeDay: DayOfWeek;
    closeTime: TimeOfDay;
}

export interface BusinessHours {
    periods: TimePeriod[];
}

export interface SpecialHourPeriod {
    startDate: { year: number; month: number; day: number };
    endDate: { year: number; month: number; day: number };
    openTime?: TimeOfDay;
    closeTime?: TimeOfDay;
    isClosed?: boolean;
}

export interface BusinessInfo {
    name: string;
    title?: string;
    description?: string;
    regularHours?: BusinessHours;
    specialHours?: { specialHourPeriods?: SpecialHourPeriod[] };
    metadata?: {
        mapsUrl?: string;
        newReviewUrl?: string;
    };
}

// ---- Local Posts ----

export type PostTopicType = 'STANDARD' | 'EVENT' | 'OFFER' | 'ALERT';

export interface CallToAction {
    actionType: string;
    url: string;
}

export interface LocalPostMedia {
    mediaFormat: string;
    sourceUrl: string;
    thumbnailUrl?: string;
}

export interface LocalPost {
    name: string;
    createTime: string;
    updateTime: string;
    topicType: PostTopicType;
    languageCode?: string;
    summary: string;
    callToAction?: CallToAction;
    media?: LocalPostMedia[];
    event?: {
        title: string;
        schedule: { startDate: object; startTime: TimeOfDay; endDate: object; endTime: TimeOfDay };
    };
}

export interface PostsResponse {
    localPosts?: LocalPost[];
    nextPageToken?: string;
}
