/**
 * When going to a path on the website that doesn't exist
 * (i.e. localhost:3000/doesntexist).
 *
 * @return {object} JSX
 */
function NotFound() {
  return (
    <h2
      id="error message"
    >Error 404 - Content not found</h2>
    // http response code 404 means Content not found
  );
}

export default NotFound; // makes it visible to other files
