export interface PostFormData {
  title: string;
  tags: Tag[];
  coverImage?: File;
  summary: string;
  content: string;
}

export interface Tag {
  id: number;
  name: string;
  isNew?: boolean;
}
