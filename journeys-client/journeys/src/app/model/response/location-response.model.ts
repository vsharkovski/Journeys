import { Location } from '../location.model';
import { Response } from './response.model';

export interface LocationResponse extends Response {}

export interface LocationInfoListResponse extends LocationResponse {
    locations: Location[];
}
