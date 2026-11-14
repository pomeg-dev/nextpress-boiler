import { handlers } from "@/nextpress.handlers";
import path from "path";

export const { GET } = handlers.blocksSchema({ themesDir: path.join(process.cwd(), "themes") });
