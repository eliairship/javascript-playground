import { Signin } from "@/routes";
import styles from "./page.module.css";

export default function MainPage(): JSX.Element {
  return (
    <main className={styles.main}>
      <Signin.Link>Login</Signin.Link>
    </main>
  );
}
