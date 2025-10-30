// "use client";
// import type React from "react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import useFetch from "@/hooks/use-fetch";
// import { FaSignInAlt, FaUser, FaLock } from "react-icons/fa";
// import { IoMdMail } from "react-icons/io";
// import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
// import { success_notification, error_notification } from "@/utils/toast.utils";
// import { signin_zod_schema } from "@repo/zod/auth.zod";
// import { TextInputMd } from "@repo/ui/index";

// interface FormValidationErrors {
//   email?: string;
//   password?: string;
// }
// interface CallApi {
//   url: string;
//   options: RequestInit;
// }

// // constants
// const HTTP_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_HTTP_BACKEND_BASE_URL;

// const URL = HTTP_BACKEND_BASE_URL + "/api/v1/auth/signin";

// const OPTIONS: RequestInit = {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   credentials: "include",
// };

// export default function Signin() {
//   const [form_data, set_form_data] = useState({
//     email: "",
//     password: "",
//   });
//   const [v_errors, set_v_errors] = useState<FormValidationErrors>({});
//   const [show_password, set_show_password] = useState(false);
//   const [call_api, set_call_api] = useState<CallApi>({ url: "", options: {} });

//   // hook for navigations
//   const router = useRouter();

//   // custom use-fetch hook
//   const { data, error, loading } = useFetch<{ message: string }>(call_api);

//   // on-change function
//   function handle_on_change(e: React.ChangeEvent<HTMLInputElement>) {
//     const target = e.target;
//     set_form_data((prev) => ({ ...prev, [target.name]: target.value }));
//   }

//   // on-submit function
//   function handle_on_submit(e: React.FormEvent) {
//     e.preventDefault();

//     // check validation errors
//     const check = signin_zod_schema.safeParse(form_data);

//     // catch validation errors
//     if (!check.success) {
//       set_v_errors({
//         [check.error?.issues[0]?.path[0]]: check.error?.issues[0]?.message,
//         [check.error?.issues[1]?.path[0]]: check.error?.issues[1]?.message,
//       });
//       return;
//     }

//     // no validation errors
//     set_v_errors({ email: "", password: "" });

//     // call custom use-fetch hook
//     set_call_api({
//       url: URL,
//       options: { ...OPTIONS, body: JSON.stringify(form_data) },
//     });
//   }

//   // check values from use-fetch hook
//   useEffect(() => {
//     if (data) {
//       success_notification(data.message);
//       router.push("/");
//     } else if (error) {
//       error_notification(error);
//       // set use-fetch hook to initial state
//       set_call_api({
//         url: "",
//         options: {},
//       });
//     }
//   }, [data, error]);

//   return (
//     <div
//       id="signin"
//       className="color-base-100 color-base-content bg-linear-to-b to-green-500 overflow-hidden p-5 sm:p-7 md:p-9"
//     >
//       <div className="flex flex-col items-center justify-center overflow-hidden">
//         <div className="color-accent color-accent-content w-full max-w-md h-auto space-y-5 p-5 rounded-2xl">
//           {/* header */}
//           <div className="text-center space-y-2">
//             <div className="flex justify-center">
//               <div className="color-primary p-3 rounded-full">
//                 <FaSignInAlt className="h-8 w-8 color-primary-content" />
//               </div>
//             </div>
//             <h3 className="text-3xl font-bold">SketchGrid</h3>
//           </div>

//           <div className="color-base-200 color-base-content rounded-xl">
//             {/* card-header */}
//             <div className="space-y-1 px-5 pt-3">
//               <h2 className="text-2xl font-semibold text-center">Sign In</h2>
//               <p className="text-base text-center">Enter your credentials to access the admin panel</p>
//             </div>

//             <form onSubmit={handle_on_submit}>
//               {/* card-content */}
//               <div className="px-6 py-4 space-y-3">
//                 <div className="space-y-2">
//                   {/* email-field */}
//                   <TextInputMd
//                     title="email"
//                     placeholder="you@example.com"
//                     value={form_data.email}
//                     on_change={handle_on_change}
//                     icon={<IoMdMail className="w-full h-full" />}
//                   />
//                   {v_errors.email && (
//                     <p id="email-validation-error" className="text-xs text-red-500" role="alert">
//                       {v_errors.email}
//                     </p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <label htmlFor="password" className="block text-sm font-medium">
//                     Password
//                   </label>
//                   <div className="relative text-base">
//                     <FaLock className="absolute left-3 top-3 h-4 w-4" />
//                     <input
//                       id="password"
//                       name="password"
//                       type={show_password ? "text" : "password"}
//                       placeholder="Enter your password"
//                       value={form_data.password}
//                       onChange={handle_on_change}
//                       className="w-full px-10 py-2 border rounded-md"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => set_show_password(!show_password)}
//                       className="absolute right-3 top-3"
//                       aria-label={show_password ? "Hide Password" : "Show Password"}
//                     >
//                       {show_password ? (
//                         <BsEyeFill className="h-4 w-4 cursor-pointer" />
//                       ) : (
//                         <BsEyeSlashFill className="h-4 w-4 cursor-pointer" />
//                       )}
//                     </button>
//                   </div>
//                   {v_errors.password && (
//                     <p id="password-error" className="text-xs text-red-500" role="alert">
//                       {v_errors.password}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Card Footer */}
//               <div className="px-6 py-4 space-y-4">
//                 <button
//                   type="submit"
//                   className="w-full color-success color-success-content font-medium py-2 px-4 rounded-md cursor-pointer"
//                   disabled={loading}
//                   aria-describedby="signin-button-description"
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center">
//                       <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                       Signing In...
//                     </div>
//                   ) : (
//                     "Sign In"
//                   )}
//                 </button>

//                 <p id="signin-button-description" className="text-sm sr-only">
//                   Click to sign-in to your account
//                 </p>

//                 {/* registration-link */}
//                 <div className="text-center text-sm">
//                   Don't have an account?&nbsp;
//                   <button
//                     type="button"
//                     className="text-blue-500 font-medium cursor-pointer"
//                     onClick={() => router.push("/auth/signup")}
//                   >
//                     Sign Up
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
