import { toast } from "sonner";

export function showError(errors: Record<string, string[]>) {
  Object.entries(errors).forEach(([field, messages]) => {
    messages.forEach((message) => {
      toast.error(`${capitalize(field)}: ${message}`);
    });
  });
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}