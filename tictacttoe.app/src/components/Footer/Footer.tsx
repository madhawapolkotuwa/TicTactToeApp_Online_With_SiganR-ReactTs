import React from 'react'

const Footer = () => {
  return (
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <svg className="bi" width="30" height="24"><use xlinkHref="#bootstrap"></use></svg>
                </a>
                <span className="mb-3 mb-md-0 text-muted">© 2024 Company, Inc</span>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex m-4">
                <li className="ms-3"><a className="text-muted" href="https://www.instagram.com/madhawa_polkotuwa/" target="_blank" rel="noopener noreferrer"><img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-128.png" alt="Instagram" width="40" height="40" /></a></li>
                <li className="ms-3"><a className="text-muted" href="https://www.facebook.com/madhawa.Polkotuwa/" target="_blank" rel="noopener noreferrer"><img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook2_colored_svg-128.png" alt="Facebook" width="40" height="40" /></a></li>
                <li className="ms-3"><a className="text-muted" href="https://www.linkedin.com/in/madhawa-p-a05418b1/" target="_blank" rel="noopener noreferrer"><img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Linkedin_unofficial_colored_svg-128.png" alt="Linkedin" width="40" height="40" /></a></li>
                <li className="ms-3"><a className="text-muted" href="https://www.youtube.com/@madhawapolkotuwa6335" target="_blank" rel="noopener noreferrer"><img src="https://www.freeiconspng.com/thumbs/youtube-logo-png/youtube-icon-app-logo-png-9.png" alt="Youtube" width="40" height="40" /></a></li>
                <li className="ms-3"><a className="text-muted" href="https://github.com/madhawapolkotuwa" target="_blank" rel="noopener noreferrer"><img className="rounded-circle" src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="Github" width="40" height="40" /></a></li>
            </ul>
        </footer>
  )
}

export default Footer