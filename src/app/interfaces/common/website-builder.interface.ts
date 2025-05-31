export interface WebsiteBuilder {
  websiteName: string;
  slug: string;
  subDomain: string;
  theme: string;
  packageId: string;
  domain?: string;
}
