<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="https://user-images.githubusercontent.com/52205/74552822-b0f85f00-4f1b-11ea-908d-48d4f301b6a3.png"
          alt="Sylph"
        />
      </b-navbar-item>
      <b-navbar-item> <b>Sylph</b> </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-dropdown label="Info">
        <b-navbar-item href="#"> About </b-navbar-item>
        <b-navbar-item href="#"> Contact </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Sign up</strong>
          </a>
          <a class="button is-light"> Log in </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
