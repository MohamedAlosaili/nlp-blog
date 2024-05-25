import { NextRequest, NextResponse } from "next/server";
import * as tagsRepo from "@/repos/tags";
import { APIJSONResponse } from "@/types";

export const GET = async (request: NextRequest) => {
  try {
    const tags = await tagsRepo.getTags();

    return NextResponse.json<APIJSONResponse>({
      success: true,
      data: tags,
    });
  } catch (error) {
    return NextResponse.json<APIJSONResponse>({
      success: false,
      errorCode: "internal_server_error",
    });
  }
};
