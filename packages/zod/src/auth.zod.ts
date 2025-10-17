import { z } from "zod";
// The regex pattern `(?=.*[character\_set])` is a **Positive Lookahead** that asserts the presence of a required character set somewhere in the string ahead of the current position without actually consuming the characters. The `?` is part of the lookahead syntax `(?=`, defining the structure itself. The **`.` (dot) is a wildcard** matching any single character, and the **`*` is a quantifier** that makes the preceding dot match zero or more times. Combined as **`.*`**, they mean "match any sequence of characters of any length," allowing the lookahead to effectively **scan the rest of the string** to ensure the required character set (like an uppercase letter, digit, or special symbol) is present. In short, the `?`, `.`, and `*` work together to check if the required character exists **anywhere** following the current position.

const signin_zod_schema = z.object({
  email: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email format"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/])[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|:;"'<>,.?/]{8,128}$/,
      `Password must have atleast 8 characters, one uppercase, one lowercase, one number, one special character - { !, @, #, $, %, ^, &, *, (, ), _, \, -, +, =, {, }, [, \, ], |, :, ;, ", ', <, >, ,, ., ?, /, }`
    ),
});

const signup_zod_schema = z.object({
  username: z
    .string()
    .regex(
      /^[a-zA-Z0-9_]{3,32}$/,
      "Username must have letters or numbers or underscores; 3-32 characters"
    ),
  email: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email format"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+={}[\]|:;"'<>,.?/])[a-zA-Z0-9!@#$%^&*()_\-+={}[\]|:;"'<>,.?/]{8,128}$/,
      `Password must have atleast 8 characters, one uppercase, one lowercase, one number, one special character - { !, @, #, $, %, ^, &, *, (, ), _, \, -, +, =, {, }, [, \, ], |, :, ;, ", ', <, >, ,, ., ?, /, }`
    ),
});

export { signin_zod_schema, signup_zod_schema };
