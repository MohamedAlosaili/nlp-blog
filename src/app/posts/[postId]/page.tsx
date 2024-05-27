interface PostProps {
  params: { postId: string };
}

const Post = ({ params }: PostProps) => {
  return <div>Post {params.postId}</div>;
};

export default Post;
