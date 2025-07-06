import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";

const Nav = () => {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-lg">Todo App</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
