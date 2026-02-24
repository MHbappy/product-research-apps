import ForgotPasswordViewPage from '@/features/auth/components/forgot-password-view';

async function getGithubStars(): Promise<number> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Kiranism/next-shadcn-dashboard-starter',
      {
        headers: process.env.GITHUB_OAUTH_TOKEN
          ? {
              Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
              'Content-Type': 'application/json'
            }
          : {},
        next: {
          revalidate: 3600
        }
      }
    );

    if (!response.ok) {
      return 1000;
    }

    const data = await response.json();
    return data.stargazers_count || 1000;
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    return 1000;
  }
}

export default async function ForgotPasswordPage() {
  const stars = await getGithubStars();
  return <ForgotPasswordViewPage stars={stars} />;
}
