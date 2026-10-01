import { Modal } from '../../components/ui/Modal'
import { useAuthModal } from './authStore'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export function AuthModals() {
  const { openModal, closeModal } = useAuthModal()

  return (
    <>
      <Modal
        isOpen={openModal === 'login'}
        onClose={closeModal}
        title="Log In"
        subtitle="Welcome back to Kino XII"
      >
        <LoginForm />
      </Modal>

      <Modal
        isOpen={openModal === 'register'}
        onClose={closeModal}
        title="Sign Up"
        subtitle="Welcome to Kino XII"
      >
        <RegisterForm />
      </Modal>
    </>
  )
}