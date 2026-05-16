import { ProfilePanel } from "@/components/page/profile-panel";

export type ProfileWidgetProps = {
  name: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  contacts?: Array<{
    label: string;
    href: string;
  }>;
};

export function ProfileWidget({ props }: { props: ProfileWidgetProps }) {
  return <ProfilePanel props={props} />;
}

export const profileWidget = {
  type: "profile",
  name: "Profile",
  description: "Avatar, name, short bio, and location.",
  defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  defaultProps: {
    name: "Your Name",
    bio: "A short introduction for your personal homepage.",
    location: "Based in Your City",
    avatarUrl: "",
    contacts: [{ label: "Recommendations", href: "#" }],
  } satisfies ProfileWidgetProps,
  Component: ProfileWidget,
};
