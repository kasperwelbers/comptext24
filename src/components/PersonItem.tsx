import { Person } from "@/types";

interface Props {
  person: Person;
}

export default function PersonItem({ person }: Props) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={person.avatar}
        alt={person.name}
        className="rounded-full h-36 object-cover aspect-square border-4 border-secondary my-1"
      />
      <h4 className="my-1 font-semibold">{person.name}</h4>
      <p className="text-center my-0 text-secondary">{person.function}</p>
    </div>
  );
}
