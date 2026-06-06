export interface SocialLink {
  platform: string;
  url: string;
  username: string;
}

export const socials: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/Yash-Marathe91",
    username: "Yash-Marathe91"
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/yash-marathe", // Placeholder, will need user to confirm if correct
    username: "yash-marathe"
  },
  {
    platform: "Email",
    url: "mailto:hello@yashmarathe.com", // Placeholder
    username: "hello@yashmarathe.com"
  }
];
