// TODO: auto generate types from supabase schema
export type Code = {
  id: number;
  url: string;
  views: number;
  goal: number;
};

export type CodeUpdate = Pick<Code, "url" | "goal"> & { id?: number };