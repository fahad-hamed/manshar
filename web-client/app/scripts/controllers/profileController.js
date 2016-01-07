'use strict';

angular.module('webClientApp')
  .controller('ProfileCtrl', ['$scope', '$rootScope', 'profile', 'articles', 'publishers', 'Article', '$state', '$stateParams','$analytics', '$anchorScroll','$window',
    function ($scope, $rootScope, profile, articles, publishers, Article, $state, $stateParams, $analytics, $anchorScroll, $window) {
    $anchorScroll();

    $rootScope.page.title = profile.name;
    $rootScope.page.description = profile.bio;

    $scope.profile = profile;
    $scope.articles = articles;

    var currentState = $state.current.url;
    $scope.currentState = currentState.substring(0, currentState.length - 1);

    if (publishers) {
      $rootScope.$emit('publishers:loaded', {
        publishers: publishers
      });
    }

    if (profile) {
      $rootScope.$emit('profile:loaded', {
        profile: profile
      });
    }

    $scope.editArticle = function (articleId) {
      $state.go('app.articles.edit', {articleId: articleId});
    };

    $scope.editProfile = function () {
      $state.go('app.publishers.profile.user.edit', {userId: $rootScope.user.id});
    };

    var deleteSuccess = function () {
      $analytics.eventTrack('Article Deleted', {
        category: 'Article'
      });
      $scope.inProgress = null;
    };

    var deleteError = function (response) {
      $scope.inProgress = null;
      $analytics.eventTrack('Delete Article Error', {
        category: 'Article',
        label: angular.toJson(response.errors)
      });
      $scope.error = 'حدث خطأ في حذف المقال.';
      $scope.inProgress = null;
    };

    /**
     * Deletes an article.
     * @param {Object} article Article data.
     */
    $scope.deleteArticle = function(article, fromList) {
      $scope.inProgress = 'delete';
      if ($window.confirm('متأكد من حذف المقال؟')) {
        Article.delete({ 'articleId': article.id }, {}, deleteSuccess, deleteError);
        var index = fromList.indexOf(article);
        fromList.splice(index, 1);
      } else {
        $scope.inProgress = null;
      }
    };

    $scope.getCardColor = function(color) {
      return color || '#C0C0C0';
    };

  }]);
