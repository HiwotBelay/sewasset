/** Sync identity collected on /route-selection into Catalyst wizards (HTML prototype: gate is s0 only, then sT-id once). */

export const ROUTE_IDENTITY_COMPLETE_KEY = "routeSelectionIdentityComplete";

export type RouteSelectionRole = "individual" | "business" | "consultant";

export type RouteProfile = Record<string, string>;

export type RouteIdentityPayload = {
  role: RouteSelectionRole;
  profile: RouteProfile;
  nda: boolean;
  route: "training" | "consulting";
};

export function peekRouteIdentityPayload(): RouteIdentityPayload | null {
  if (typeof window === "undefined") return null;
  if (sessionStorage.getItem(ROUTE_IDENTITY_COMPLETE_KEY) !== "true") return null;
  const route = sessionStorage.getItem("selectedRoute");
  if (route !== "training" && route !== "consulting") return null;
  const role = sessionStorage.getItem("selectedRole") as RouteSelectionRole | null;
  if (role !== "individual" && role !== "business" && role !== "consultant") return null;
  const raw = sessionStorage.getItem("routeSelectionProfile");
  if (!raw) return null;
  try {
    const profile = JSON.parse(raw) as RouteProfile;
    const nda = sessionStorage.getItem("routeSelectionNda") === "true";
    return { role, profile, nda, route };
  } catch {
    return null;
  }
}

export function consumeRouteIdentityPayload(): RouteIdentityPayload | null {
  const p = peekRouteIdentityPayload();
  if (p) sessionStorage.removeItem(ROUTE_IDENTITY_COMPLETE_KEY);
  return p;
}
