<script>
	let searchBox = "";
	let results = [];
	let isInitialSearchDone = false
	let isSearching = false
	import {onMount} from 'svelte'
	onMount(() => {
		let os = (new URL(document.location)).searchParams.get('query')
		if (os) {
			searchBox = os
			handleSubmit()
		}
	})
	function google() {
		document.location = 'https://www.google.com/search?q=' + searchBox
	}
	function handleSubmit() {
		isSearching = true
		fetch("/.netlify/functions/search?q=" + searchBox)
			.then((x) => x.json())
			.then(({ links }) => {
				results = links;
				document.getElementById('head').scrollIntoView();
			})
			.catch(err => {
				alert(err)
			})
			.finally(() => {
				isSearching = false
				isInitialSearchDone = true
			});
	}
</script>
<style>
	h3 {
		margin-bottom: 0.5rem;
	}
	.searchbox {
		width: 30ch;
	}
	@media screen and (max-width: 400px) {
		form {
			position: fixed;
			bottom: 1rem;
			font-size: 2rem;
			display: flex;
			width: 100%;
			flex-direction: column-reverse;
		}
		input {
			width: 100%;
		}
		.searchbox {
			width: initial;
		}
		.externalLink {
			height: 2rem;
			width: 2rem;
		}
	}
	ul {
    list-style: none;
    padding: 0;
	}
	main {
		margin: 8px;
	}
	.externalLink {
		height: 16px;
		width: 16px;
	}
	form {
		max-width: 800px;
		display: flex;
		justify-content: space-between;
	}
</style>
<main>
	<h1 id="head">Swyx Search!</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<div>
			<!-- svelte-ignore a11y-autofocus -->
			<input class="searchbox" type="text" bind:value={searchBox} disabled={isSearching} autofocus />
			<button type="submit">{isSearching ? '...' : 'Search'}</button>
		</div>
		<div>
			<button type="button" on:click={google}><svg class="externalLink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
				<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
				<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
			</svg>Google</button>
			<a href={'https://www.bing.com/search?q=' + searchBox}>Bing</a>
		</div>
	</form>
	{#if !isInitialSearchDone}
	<div>Search something!</div>
	{:else}
	<ul>
		{#if results.statusCode}
			<h3 style="color: red">Error: {results.statusCode}</h3>
			<blockquote>
				{results.body}
			</blockquote>
		{:else}
			{#each results as res}
				<li>
				{#if res.href.startsWith('/imgres')}
					Image: <span><a href={res.href.startsWith('/') ? "https://google.com" + res.href : res.href}>{res.href.slice(22,120) + '...'}</a></span>
				{:else}
					<h3><a href={res.href}>{res.linktext}</a></h3>
					<span><a href={res.href}>{res.href}</a></span>
					<div>{res.siblingtext}</div>
					{/if}
				</li>
			{:else}No results{/each}
		{/if}
	</ul>
	{/if}
	
</main>
