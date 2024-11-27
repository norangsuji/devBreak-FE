import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import NavBar from "../../components/NavBar";
import GoToButton from "../../components/GoToButton";
import FormField from "../../components/Workspace/FormField";
import Input from "../../components/Workspace/Input";
import TextArea from "../../components/Workspace/TextArea";
import Dropdown from "../../components/Breakthrough/Dropdown";
import { useAuth } from "../../context/AuthContext";
import getRepos from "../../APIs/get/getRepos";
import getAuthInfo from "../../APIs/get/getAuthInfo";
import postBlog from "../../APIs/post/postBlog";

function MakeBlogPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [formData, setFormData] = useState({
    blogName: "",
    description: "",
    gitRepoUrl: "pick one from your Github account",
    blogMember: [],
  });

  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoggedIn) {
        navigate("/login");
        return;
      }
      try {
        await fetchRepos();
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isLoggedIn, navigate]);

  const fetchRepos = async () => {
    try {
      const repos = await getRepos();
      const userData = await getAuthInfo();
      console.log("userName:", userData.userName);
      setGithubRepos(repos);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGitRepoSelection = (repo) => {
    setFormData((prev) => ({
      ...prev,
      gitRepoUrl: repo,
    }));
  };

  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    if (name === "blogMember") {
      setFormData((prev) => ({
        ...prev,
        blogMember: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { blogName, description, gitRepoUrl, blogMember } = formData;

    if (!blogName || !description || gitRepoUrl === "pick one from your Github account") {
      alert("Please fill out all required fields.");
      return;
    }

    const blogData = {
      blogName,
      description,
      gitRepoUrl,
      blogMember,
    };

    try {
      const response = await postBlog(
        blogData.blogName,
        blogData.description,
        blogData.gitRepoUrl,
        blogData.blogMember
      );
      console.log("Blog created successfully:", response);

      // 블로그 생성 후 해당 페이지로 이동
      navigate(`/workspace/myblog/${response.blog_id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <div>Loading GitHub Repositories...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <NavBar onLogout={handleLogout} />
      <Container>
        <FormContainer>
          <Title>Create a new tech blog</Title>
          <Subtitle>
            A little note: Anyone on the Internet can see this tech blog. <br />
            Please fill out all fields marked with an asterisk (*).
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <FormField label="Blog name" required>
              <Input type="text" name="blogName" value={formData.blogName} onChange={handleChange} required />
            </FormField>

            <FormField label="Description" required>
              <TextArea name="description" value={formData.description} onChange={handleChange} required />
            </FormField>

            <FormField label="Github repository link" required>
              <Dropdown
                selectedValue={formData.gitRepoUrl}
                setSelectedValue={handleGitRepoSelection}
                items={githubRepos}
              />
            </FormField>

            <FormField label="Additional contributors' Github Id" required>
              <Input
                type="text"
                name="blogMember"
                value={formData.blogMember.join(", ")} // 배열을 문자열로 표시
                onChange={handleMemberChange}
                required
              />
            </FormField>

            <ButtonContainer>
              <GoToButton text="Create Blog" type="submit" />
            </ButtonContainer>
          </Form>
        </FormContainer>
      </Container>
    </>
  );
}

export default MakeBlogPage;

// Styled components
const Container = styled.div`
  font-family: "Pretendard";
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 300px;
`;

const FormContainer = styled.div`
  margin: 60px auto;
  align-items: center;
  min-width: 930px;
`;

const Title = styled.h1`
  font-size: 45px;
  margin-bottom: 15px;
  font-weight: 500;
`;

const Subtitle = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 15px;
  line-height: 25px;
  font-weight: 500;
  margin-bottom: 64px;
  padding: 10px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 100px;
`;

const ButtonContainer = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
