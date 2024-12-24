import zod from "zod";

export const GetAutoCompleteSuggestionsSchema = zod.object({
  input: zod.string(),
});

export type GetAutoCompleteSuggestions = zod.infer<typeof GetAutoCompleteSuggestionsSchema>;
