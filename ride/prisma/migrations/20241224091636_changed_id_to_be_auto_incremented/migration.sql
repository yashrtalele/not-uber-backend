-- AlterTable
CREATE SEQUENCE ride_id_seq;
ALTER TABLE "Ride" ALTER COLUMN "id" SET DEFAULT nextval('ride_id_seq');
ALTER SEQUENCE ride_id_seq OWNED BY "Ride"."id";
