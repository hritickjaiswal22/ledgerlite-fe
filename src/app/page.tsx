import { Button } from "@/components/ui/button";
import ModeToggler from "@/components/theme-toggle";

function Home() {
  return (
    <div>
      <Button size={"lg"}>Create your account</Button>

      <ModeToggler />
    </div>
  );
}

export default Home;
