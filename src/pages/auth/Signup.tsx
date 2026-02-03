const SignUp = () => {
  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="mt-2 text-muted-foreground">
          Sign up to get started with Veld
        </p>
      </div>
      
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="terms" className="ml-2 block text-sm">
            I agree to the{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create account
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth/login" className="font-medium text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;