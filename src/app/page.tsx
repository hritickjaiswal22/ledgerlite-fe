import { Button } from "@/components/ui/button";
import ModeToggler from "@/components/theme-toggle";

function Home() {
  return (
    <div>
      <Button size={"lg"}>Hello World</Button>

      <ModeToggler />
    </div>
  );
}

export default Home;
