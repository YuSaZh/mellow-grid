import { BentoCard } from "@/components/ui/bento-card";

export type ProfileWidgetProps = {
  name: string;
  bio: string;
  location: string;
  avatarUrl?: string;
};

export function ProfileWidget({ props }: { props: ProfileWidgetProps }) {
  return (
    <BentoCard className="flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <div
          className="grid size-20 place-items-center overflow-hidden rounded-full bg-cover bg-center bg-zinc-950 text-2xl font-semibold text-white"
          style={props.avatarUrl ? { backgroundImage: `url(${props.avatarUrl})` } : undefined}
        >
          {props.avatarUrl ? null : props.name.slice(0, 1)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">{props.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{props.location}</p>
        </div>
      </div>
      <p className="mt-8 max-w-sm text-lg leading-7 text-zinc-700">{props.bio}</p>
    </BentoCard>
  );
}

export const profileWidget = {
  type: "profile",
  name: "Profile",
  description: "Avatar, name, short bio, and location.",
  defaultLayout: { w: 4, h: 3, minW: 3, minH: 2 },
  defaultProps: {
    name: "Hanam",
    bio: "Developer building a mellow corner of the web.",
    location: "Based on Earth",
    avatarUrl: "",
  } satisfies ProfileWidgetProps,
  Component: ProfileWidget,
};
