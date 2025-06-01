export const protectedPrefixes = [
    "/product/upload",
    "/product/edit",
    "/user",
    "/history",
];

export const isProtectedPath = (pathname) =>
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
