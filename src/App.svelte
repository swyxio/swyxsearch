<script>
	let searchBox = "";
	let results = [];
	function handleSubmit() {
		fetch("/.netlify/functions/search?q=" + searchBox)
			.then((x) => x.json())
			.then(({ links }) => {
				results = links;
			});
	}
</script>
<style>
	h3 {
		margin-bottom: 0.5rem;
	}
	ul {
    list-style: none;
    padding: 0;
	}
</style>
<main>
	<h1>Swyx Search!</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<input type="text" bind:value={searchBox} />
		<button type="submit">Search</button>
	</form>
	<ul>
		{#each results as res}
			<li>
				<h3><a href={res.href}>{res.linktext}</a></h3>
				<span><a href={res.href}>{res.href}</a></span>
				<div>{res.siblingtext}</div>
			</li>
		{:else}No results{/each}
	</ul>
</main>
