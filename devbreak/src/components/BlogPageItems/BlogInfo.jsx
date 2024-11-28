import styled from "@emotion/styled";
import { BsStarFill, BsGithub, BsPencil } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import putBlogBlogIdFavorites from "../../APIs/put/putBlogBlogIdFavorites";
import BlogDeleteModal from "./BlogDeleteModal";
import deleteBlogBlogId from "../../APIs/delete/deleteBlogBlogId";
import getBlogBlogId from "../../APIs/get/getBlogBlogId";

function BlogInfo({ blogData, favButton, handleFavButtonClick, isLoggedIn, blogId, currentUserId }) {

  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(favButton);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blog = await getBlogBlogId(blogId); // API 호출로 블로그 정보 얻기

        // localStorage에서 즐겨찾기 상태 확인
        const storedFavoriteStatus = localStorage.getItem(`fav_button_${blogId}`);
        if (storedFavoriteStatus !== null) {
          setIsFavorite(JSON.parse(storedFavoriteStatus));  // 저장된 상태로 설정
        } else {
          setIsFavorite(blog.fav_button); // API 응답에서 받은 fav_button 값으로 설정
          localStorage.setItem(`fav_button_${blogId}`, JSON.stringify(blog.fav_button)); // localStorage에 저장
        }
      } catch (error) {
        console.error("블로그 팔로우 정보 가져오기 실패:", error);
      }
    };
    fetchBlogData();
  }, [blogId]); 

  const handleGitHubClick = () => window.open(blogData.git_repo_url, "_blank");

  const handlePencilClick = () => {
    navigate(`/blog/${blogId}/edit`); // 블로그 수정 페이지로 이동
  };

  // 휴지통 아이콘 클릭 시 모달 열기
  const handleTrashClick = () => {
    console.log("blogId:", blogId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isMember = blogData.members.includes(currentUserId);


  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 즐겨찾기를 추가할 수 있습니다.");
      navigate("/login");
      return;
    }

    try {
      const updatedBlogData = await putBlogBlogIdFavorites(blogId);  // 즐겨찾기 상태 서버에 반영
      const newFavStatus = !isFavorite;  // 상태 반전
      setIsFavorite(newFavStatus);  // 상태 갱신
      localStorage.setItem(`fav_button_${blogId}`, JSON.stringify(newFavStatus));  // localStorage에 반영
      handleFavButtonClick(newFavStatus);  // 부모 컴포넌트로 상태 전달
    } catch (error) {
      console.error("즐겨찾기 업데이트 오류:", error);
    }
  };


  return (
    <>
      <InfoContainer>
        <NameContainer>
          <BlogName>{blogData.blog_name}</BlogName>
          <StarButton
            onClick={handleFavoriteClick}
            style={{
              color: isFavorite ? "white" : "#FFEC4C",
            }}
          >
            <BsStarFill size={30} />
          </StarButton>
        </NameContainer>
        <DescriptionContainer>
          <BlogDescription>
            {blogData.description}
            <IconContainer onClick={handleGitHubClick}>
              <BsGithub size={24} />
            </IconContainer>
            {isLoggedIn && isMember && (
              <IconContainer>
                <BsPencil size={24} onClick={handlePencilClick} />
                <FaRegTrashCan size={24} onClick={handleTrashClick} />
              </IconContainer>
            )}
          </BlogDescription>
        </DescriptionContainer>
      </InfoContainer>

      {/* 삭제 모달 */}
      {isModalOpen && <BlogDeleteModal blogId={blogId} onClose={handleCloseModal}/>}
    </>
  );
}

BlogInfo.propTypes = {
  blogData: PropTypes.object.isRequired,
  favButton: PropTypes.bool.isRequired,
  handleFavButtonClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  blogId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default BlogInfo;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 52vw;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.6vw;
  margin-bottom: 2vh;
`;

const BlogName = styled.div`
  font-size: 3.5vh;
  font-weight: bold;
  margin: 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.9;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  white-space: normal;
  word-break: break-word;
`;

const BlogDescription = styled.div`
  font-size: 2.5vh;
  max-width: 60vw;
  display: flex;
  flex-direction: row;
  justify-content: baseline;
  align-items: baseline;
`;

const IconContainer = styled.div`
  margin-left: 0.7vw;
  display: flex;
  flex-direction: row;
  gap: 0.7vw;
  cursor: pointer;
`;
