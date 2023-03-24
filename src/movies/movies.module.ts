import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schema/movies.schema';
import { HttpModule } from '@nestjs/axios';
import { UserReaction, UserReactionSchema } from './schema/reactions.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: UserReaction.name, schema: UserReactionSchema },
    ]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
