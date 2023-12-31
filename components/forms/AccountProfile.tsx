"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { RiLoader4Fill, RiLoader5Fill } from "react-icons/ri";

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  buttonTitle: string;
}

export default function AccountProfile({
  user,
  buttonTitle,
}: AccountProfileProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [pending, setPending] = useState<boolean>(false);
  const { startUpload } = useUploadThing("media");

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  function handleImage(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  }

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    setPending(true);

    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    // upload image to uploadthing
    if (hasImageChanged) {
      const imageResponse = await startUpload(files);
      if (imageResponse && imageResponse[0].fileUrl) {
        values.profile_photo = imageResponse[0].fileUrl;
      }
    }

    // update user profile
    // passing via an object then destructure it
    // by this we dont have to worry if it on the same order or not (the database would be mixed up)

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
      setPending(false);
    } else {
      router.push("/");
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/**"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full flex-col">
              <FormLabel className=" text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className=" account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full flex-col">
              <FormLabel className=" text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className=" account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex gap-3 w-full flex-col">
              <FormLabel className=" text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className=" account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* PR ADD LOADING STATE */}
        <Button
          type="submit"
          className=" bg-sky-500 hover:bg-gray-700 transition-all ease-in duration-200"
        >
          {pending ? (
            <div className="relative w-fit h-[24px] animate-spin">
              <RiLoader5Fill className=" shrink-0 text-heading3-bold " />
              <RiLoader4Fill className=" shrink-0 text-heading3-bold absolute bottom-0 text-white/30" />
            </div>
          ) : (
            buttonTitle
          )}{" "}
        </Button>
      </form>
    </Form>
  );
}
