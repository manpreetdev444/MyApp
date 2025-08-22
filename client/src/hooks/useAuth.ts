import { useQuery } from "@tanstack/react-query";
import type { User, Couple, Vendor } from "@shared/schema";

interface AuthUser extends User {
  roleData?: Couple | Vendor;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
