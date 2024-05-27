import { NextRequest, NextResponse } from "next/server";
import * as tagsRepo from "@/repos/tags";
import { APIJSONResponse } from "@/types";

// Opt out of caching for all data requests in the route segment
export const revalidate = 0;

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
