<script>
	let searchBox = "";
	let results = [];
	let isSearching = false
	import {onMount} from 'svelte'
	onMount(() => {
		let os = (new URL(document.location)).searchParams.get('query')
		if (os) {
			searchBox = os
			handleSubmit()
		}
	})
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
			}).finally(() => {
				isSearching = false
			});
	}
</script>
<style>
	h3 {
		margin-bottom: 0.5rem;
	}
	@media screen and (max-width: 400px) {
		form {
			position: fixed;
			bottom: 1rem;
			font-size: 2rem;
			display: flex;
			width: 100%;
			flex-direction: row-reverse;
		}
		input {
			width: 100%;
		}
	}
	ul {
    list-style: none;
    padding: 0;
	}
	main {
		margin: 8px;
	}
</style>
<main>
	<h1 id="head">Swyx Search!</h1>
	<form on:submit|preventDefault={handleSubmit}>
		<input type="text" bind:value={searchBox} disabled={isSearching} />
		<button type="submit">{isSearching ? '...' : 'Search'}</button>
	</form>
	<ul>
		{#each results as res}
			<li>
			{#if res.href.startsWith('/imgres')}
				Image: <span><a href={res.href}>{res.href.slice(22,120) + '...'}</a></span>
			{:else}
				<h3><a href={res.href}>{res.linktext}</a></h3>
				<span><a href={res.href}>{res.href}</a></span>
				<div>{res.siblingtext}</div>
				{/if}
			</li>
		{:else}No results{/each}
	</ul>
</main>
