export interface PostFormData {
  title: string;
  authorName?: string;
  slug: string;
  tags: Tag[];
  coverImage: string;
  summary: string;
  content: string;
  isPublished?: boolean;
}

export interface CommentFormData {
  senderName: string;
  content: string;
  postId: number;
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
