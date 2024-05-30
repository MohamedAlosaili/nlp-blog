export interface PostFormData {
  title: string;
  tags: Tag[];
  coverImage: string;
  summary: string;
  content: string;
  isPublished?: boolean;
}

export interface EditPostData extends PostFormData {
  id: number;
}

export interface EditDraftData extends PostFormData {
  id: number;
}

export interface Tag {
  id: number;
  name: string;
}

export type PostType = "drafts" | "posts";
export type SubmitButtonType = "draft" | "publish";
