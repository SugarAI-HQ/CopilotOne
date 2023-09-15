import type { ReactElement } from 'react'
const SiteLayout = ({ children }:{children:React.ReactNode}) => (<>{children}</>)
export const getLayout = (page:ReactElement) => <SiteLayout>{page}</SiteLayout>;
export default SiteLayout;