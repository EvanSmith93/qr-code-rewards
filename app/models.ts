// TODO: auto generate types from supabase schema
export type Code = {
  id: number;
  title?: string;
  url: string;
  views: number;
  goal: number;
};

export type CodeUpdate = Pick<Code, "title" | "url" | "goal"> & { id?: number };
