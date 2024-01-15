import { hash } from "bcrypt";
import { z } from "zod";
import { db } from "~/lib/db";
import { UserRegisterValidator } from "~/lib/validators/user";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, email, password } = UserRegisterValidator.parse(data);

    const existingName = await db.user.findFirst({
      where: {
        name
      }
    });

    if (existingName) {
      return new Response("username taken", { status: 409 });
    }

    const existingEmail = await db.user.findFirst({
      where: {
        email
      }
    });

    if (existingEmail) {
      return new Response("email in use", { status: 409 });
    }

    const hashedPass = await hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPass
      }
    });

    return new Response("ok");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(err.message, { status: 422 });
    }

    console.log("[USERS_REGISTER]", err);
    return new Response("Internal Error", { status: 500 });
  }
}
