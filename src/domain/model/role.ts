export const Role = {
    MEMBER: "MEMBER",
    ADMIN: "ADMIN"
} as const;

export type Role = typeof Role[keyof typeof Role];