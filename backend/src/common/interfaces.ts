import { PageOptionsDto } from '../dto/page-options.dto';

/**
 * Google OAuth user payload interface
 */
export interface OAuthGoogleUserPayload {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

/**
 * Page meta dto parameters
 */
export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
