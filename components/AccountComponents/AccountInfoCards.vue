<template>
  <v-col md="6" cols="12" class="info-card">
    <div class="card-info-content d-flex align-center flex-column">
      <h2 class="card-info-title font-weight-bold white--text">
        {{ cardTitle }}
      </h2>
      <p class="title-decoratoin d-flex align-center ma-0">
        <span class="rounded"></span>
        <i class="fas fa-star"></i>
        <span class="rounded"></span>
      </p>
      <h6>{{ cardDescription }}</h6>
      <nuxt-link :to="localePath(cardLink)" class="white--text">
        {{ cardLinkText }}
      </nuxt-link>
    </div>
  </v-col>
</template>

<script>
export default {
  name: "AccountInfoCards",
  props: ["cardTitle", "cardDescription", "cardLink", "cardLinkText"],
};
</script>

<style scoped>
.info-card:first-of-type {
  padding-left: 10px;
}

.info-card:last-of-type {
  padding-right: 10px;
}

.card-info-content {
	height: 100% !important;
  padding: 65px 10px;
  background: url("@/assets/images/Home-Page-Images/home-pattern.png"),
    linear-gradient(67deg, #36399a, #4c4da0);
  border-radius: 10px;
}

.card-info-title {
  margin-bottom: 9px;
}

span {
  width: 70px;
  height: 2px;
  margin-top: 2px;
  background-color: #ffc961;
}

i {
  color: #ffc961;
  margin: 0 3px;
}

h6 {
  margin: 25px 0;
  color: #a4abbb;
  font-weight: 600;
  text-align: center !important;
  line-height: 27px !important;
}

a {
  padding: 7px 40px;
  font-size: 20px;
  font-family: "Almarai";
  background-image: linear-gradient(
    -4deg,
    rgba(254, 94, 147, 0.8),
    rgba(253, 75, 121, 0.8)
  );
  border-radius: 10px;
}

@media only screen and (max-width: 600px) {
	.card-info-title {
		font-size: 23px !important;
	}
}

@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .card-info-content {
    padding: 45px 10px !important;
  }

	.card-info-title {
		font-size: 23px !important;
	}
}

@media only screen and (min-width: 1264px) and (max-width: 1332px) {
	.card-info-title {
		font-size: 27px !important;
	}
}

@media only screen and (min-width: 767px) and (max-width: 960px) {

}
</style>
