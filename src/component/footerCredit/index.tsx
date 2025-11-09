import "./index.scss"

export function FooterCredit() {
  return (
    <div className="footer-credit" aria-label="music-license-credit">
      Music: “Piano Sonata No. 5 in G major, K. 283” — Performance by Paavali Jumppanen, from
      <a href="https://musopen.org/music/9-piano-sonata-no-5-in-g-major-k-283/" target="_blank" rel="noreferrer"> Musopen</a>,
      licensed under
      <a href="https://creativecommons.org/licenses/by-nc-nd/3.0/" target="_blank" rel="noreferrer"> CC BY-NC-ND 3.0</a>.
      No changes were made.
    </div>
  )
}
