function scrapeData() {
	let data = [];
	const cachedComments = document.querySelectorAll(
		".style-scope.ytd-comment-thread-renderer",
	);
	cachedComments.forEach((v) => {
		const comment = v.querySelector(
			".yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap",
		);
		if (comment) {
			data.push(comment.textContent);
		}
	});
	return data;
}
setInterval(() => {
	const data = scrapeData();
	console.log(data);
}, 10000);
