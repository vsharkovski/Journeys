import { Location } from './location.model';

export interface CreatePostRequest {
    title: string;
    description: string;
    totalCost: number;
    costComment: string;
    picture?: File;
    fromDate: number;
    toDate: number;
    locations: Location[];
    rating: number;
}
