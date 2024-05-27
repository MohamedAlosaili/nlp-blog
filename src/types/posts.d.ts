export interface PostFormData {
  title: string;
  tags: Tag[];
  coverImage: string;
  summary: string;
  content: string;
}

export interface Tag {
  id: number;
  name: string;
}
